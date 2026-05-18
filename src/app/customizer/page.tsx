"use client";

import dynamic from "next/dynamic";
import {
  Upload,
  Grid3x3,
  Sparkles,
  Package,
  Move,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Image as ImageIcon,
  X,
  Copy,
  Menu,
  ShoppingCart,
  Home,
  LayoutGrid,
  Palette,
  Pipette,
  CheckCircle2,
  Minus,
  Plus,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/contexts/preferences-context";
import { CAD_TO_USD, PRICE_CAD } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { track } from "@/lib/analytics/track";
import { addItem as addCartItem } from "@/lib/cart/cart";
import {
  customizerDesignTemplates,
  findDesignTemplateByImage,
} from "@/lib/design-templates";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const MugViewer = dynamic(() => import("@/components/3d/mug-viewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[520px] items-center justify-center rounded-[28px] border border-primary/10 bg-[#0d0f0d]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-white/55">Loading 3D Viewer...</p>
      </div>
    </div>
  ),
});

type SectionKey = "section1" | "section2" | "section3";
type SectionImages = Record<SectionKey, string | null>;
type SectionImageTypes = Record<SectionKey, "uploaded" | null>;
type SectionImageScales = Record<SectionKey, number>;
type ArtworkMode = "full-wrap" | "panel";
type ArtworkSource = "template" | "upload";
type UploadPrintMode = "sections" | "full-wrap";

type WrapArtwork = {
  image: string;
  fit: "cover" | "contain";
  mode: ArtworkMode;
  source: ArtworkSource;
  focalX?: number;
  focalY?: number;
  wrapOffsetX?: number;
  previewRotation?: number;
  scale?: number;
};

const sectionOrder: SectionKey[] = ["section1", "section2", "section3"];

export default function CustomizerPage() {
  const [sectionImages, setSectionImages] = useState<SectionImages>({
    section1: null,
    section2: null,
    section3: null,
  });
  const [imageTypes, setImageTypes] = useState<SectionImageTypes>({
    section1: null,
    section2: null,
    section3: null,
  });
  const [sectionImageScales, setSectionImageScales] = useState<SectionImageScales>({
    section1: 1,
    section2: 1,
    section3: 1,
  });
  const [selectedWrapArtwork, setSelectedWrapArtwork] = useState<WrapArtwork | null>(null);
  const [previewResetToken, setPreviewResetToken] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionKey>("section1");
  const [uploadPrintMode, setUploadPrintMode] = useState<UploadPrintMode>("sections");
  const [isDragging, setIsDragging] = useState(false);
  const [cupType, setCupType] = useState<"hotzy" | "standard">("hotzy");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderNowStatus, setOrderNowStatus] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageRotation, setImageRotation] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const hasTrackedCustomizerView = useRef(false);

  const router = useRouter();
  const { currency, getText } = usePreferences();
  const createDraft = useMutation(api.orders.createDraft);

  useEffect(() => {
    try {
      if (hasTrackedCustomizerView.current) return;
      hasTrackedCustomizerView.current = true;
      void trackEvent("customizer_view", {
        page_context: "customizer",
        cup_type: cupType,
      });
    } catch {}
  }, [cupType]);

  useEffect(() => {
    try {
      void trackEvent("view_item", {
        item_name: "Custom Mug",
        item_category: "Mugs",
        item_variant: cupType,
      });
    } catch {}
  }, [cupType]);

  const uploadedImageCount = Object.values(imageTypes).filter(
    (type) => type === "uploaded"
  ).length;

  const basePriceCad = PRICE_CAD[cupType];
  const unitPriceAmount =
    currency === "USD" ? basePriceCad * CAD_TO_USD : basePriceCad;
  const displayPriceAmount = unitPriceAmount * quantity;
  const displayPrice = `$${new Intl.NumberFormat("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(displayPriceAmount)} ${currency}`;
  const unitDisplayPrice = `$${new Intl.NumberFormat("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(unitPriceAmount)} ${currency}`;

  const currentSectionImage = sectionImages[activeSection];
  const currentSectionType = imageTypes[activeSection];
  const selectedWrapTemplate =
    selectedWrapArtwork?.source === "template"
      ? findDesignTemplateByImage(selectedWrapArtwork.image)
      : undefined;
  const hasWrapArtwork = Boolean(selectedWrapArtwork);
  const hasTemplateWrap = selectedWrapArtwork?.source === "template";
  const hasUploadWrap = selectedWrapArtwork?.source === "upload";
  const currentImageScale = hasWrapArtwork
    ? selectedWrapArtwork?.scale ?? 1
    : sectionImageScales[activeSection];
  const selectedWrapMode = selectedWrapArtwork?.mode ?? "full-wrap";
  const activeSectionNumber = activeSection.replace("section", "");
  const isFullCoverageUploadMode = uploadPrintMode === "full-wrap";

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result !== "string") {
          reject(new Error("Failed to read file"));
          return;
        }
        resolve(result);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  const scrollToCustomizerPanel = (
    panelId: "preview-panel" | "upload-panel" | "templates-panel" | "finish-panel",
    block: ScrollLogicalPosition = "start"
  ) => {
    document
      .getElementById(panelId)
      ?.scrollIntoView({ behavior: "smooth", block });
  };

  const applyDesignToSections = (designImage: string) => {
    setSelectedWrapArtwork(null);
    setSectionImages((prev) => ({ ...prev, [activeSection]: designImage }));
    setImageTypes((prev) => ({ ...prev, [activeSection]: "uploaded" }));
    setSectionImageScales((prev) => ({ ...prev, [activeSection]: 1 }));
  };

  const applyDesignAsFullWrap = (designImage: string) => {
    setSelectedWrapArtwork({
      image: designImage,
      fit: "contain",
      mode: "full-wrap",
      source: "upload",
      focalX: 0.5,
      focalY: 0.5,
      wrapOffsetX: 0,
      previewRotation: -0.55,
      scale: 0.9,
    });
    setImagePosition({ x: 0, y: 0 });
    setImageRotation(0);
  };

  const applyUploadedDesign = (designImage: string) => {
    if (uploadPrintMode === "full-wrap") {
      applyDesignAsFullWrap(designImage);
      return;
    }

    applyDesignToSections(designImage);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedImage = await readFileAsDataUrl(file);
      applyUploadedDesign(uploadedImage);

      void track("design_upload_success", {
        cup_type: cupType,
        section: uploadPrintMode === "full-wrap" ? "full_wrap" : activeSection,
        print_mode: uploadPrintMode,
        file_type: file.type || "unknown",
        file_size_kb: Math.round(file.size / 1024),
      });
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      e.target.value = "";
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    try {
      void track("design_upload_start", {
        cup_type: cupType,
        section: uploadPrintMode === "full-wrap" ? "full_wrap" : activeSection,
        print_mode: uploadPrintMode,
        method: "drop",
      });

      const uploadedImage = await readFileAsDataUrl(file);
      applyUploadedDesign(uploadedImage);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleTemplateSelect = (templateImage: string) => {
    const selectedTemplate = findDesignTemplateByImage(templateImage);
    const templateFit =
      selectedTemplate?.payload_to_customizer?.fit === "contain" ? "contain" : "cover";
    const templateArea = selectedTemplate?.payload_to_customizer?.area;
    const mode: ArtworkMode =
      templateArea === "full" || selectedTemplate?.wrap === "full"
        ? "full-wrap"
        : "panel";

    setSelectedWrapArtwork({
      image: templateImage,
      fit: templateFit,
      mode,
      source: "template",
      focalX: mode === "full-wrap" ? selectedTemplate?.focalX ?? 0.5 : undefined,
      focalY: mode === "full-wrap" ? selectedTemplate?.focalY ?? 0.5 : undefined,
      wrapOffsetX:
        mode === "full-wrap" ? selectedTemplate?.wrapOffsetX ?? 0 : undefined,
      previewRotation:
        mode === "full-wrap" ? selectedTemplate?.previewRotation ?? -0.55 : undefined,
      scale: 1,
    });
    setImagePosition({ x: 0, y: 0 });
    setImageRotation(0);

    if (selectedTemplate) {
      void track("template_apply", {
        cup_type: cupType,
        template_id: selectedTemplate.id,
        template_name: selectedTemplate.name,
        application_scope: mode === "full-wrap" ? "full_mug" : "panel",
      });
    }
  };

  const handleClearWrapArtwork = () => setSelectedWrapArtwork(null);

  const handleRemoveImage = (section: SectionKey) => {
    setSectionImages((prev) => ({ ...prev, [section]: null }));
    setImageTypes((prev) => ({ ...prev, [section]: null }));
    setSectionImageScales((prev) => ({ ...prev, [section]: 1 }));
  };

  const handleDuplicateToAll = () => {
    if (!currentSectionImage) return;
    setSectionImages({
      section1: currentSectionImage,
      section2: currentSectionImage,
      section3: currentSectionImage,
    });
    setImageTypes({
      section1: currentSectionType,
      section2: currentSectionType,
      section3: currentSectionType,
    });
    setSectionImageScales({
      section1: currentImageScale,
      section2: currentImageScale,
      section3: currentImageScale,
    });
  };

  const resetPositionControls = () => {
    setImagePosition({ x: 0, y: 0 });
    setImageRotation(0);
    if (hasWrapArtwork) {
      setSelectedWrapArtwork((prev) => (prev ? { ...prev, scale: 1 } : prev));
    } else {
      setSectionImageScales((prev) => ({ ...prev, [activeSection]: 1 }));
    }
  };

  const updateImageScale = (nextScale: number) => {
    if (!Number.isFinite(nextScale)) return;
    const clampedScale = Math.min(2, Math.max(0.5, nextScale));

    if (hasWrapArtwork) {
      setSelectedWrapArtwork((prev) =>
        prev ? { ...prev, scale: clampedScale } : prev
      );
      return;
    }

    setSectionImageScales((prev) => ({
      ...prev,
      [activeSection]: clampedScale,
    }));
  };

  const moveImage = (direction: "up" | "down" | "left" | "right") => {
    const step = 0.05;
    setImagePosition((prev) => {
      switch (direction) {
        case "up":
          return { ...prev, y: Math.max(prev.y - step, -0.5) };
        case "down":
          return { ...prev, y: Math.min(prev.y + step, 0.5) };
        case "left":
          return { ...prev, x: Math.min(prev.x + step, 0.5) };
        case "right":
          return { ...prev, x: Math.max(prev.x - step, -0.5) };
        default:
          return prev;
      }
    });
  };

  const updateQuantity = (nextQuantity: number) => {
    if (!Number.isFinite(nextQuantity)) return;
    setQuantity(Math.min(999, Math.max(1, Math.round(nextQuantity))));
  };

  const handleAddToCart = async () => {
    try {
      const priceCents = Math.round(unitPriceAmount * 100);
      const hasCustomDesign = uploadedImageCount > 0 || hasWrapArtwork;

      addCartItem({
        id: `custom-mug-${Date.now()}`,
        name: hasCustomDesign
          ? getText("Custom Design Mug", "Tasse design personnalisee")
          : getText("Premium Black Mug", "Tasse Noire Premium"),
        priceCents,
        currency,
        qty: quantity,
        meta: {
          sectionImages,
          sectionImageScales,
          fullWrapArtwork: selectedWrapArtwork,
          fullWrapTemplate: selectedWrapArtwork?.image ?? null,
          selectedTemplateId: hasTemplateWrap ? selectedWrapTemplate?.id ?? null : null,
          layoutMode: hasWrapArtwork ? "full-wrap" : "triple",
          productType: "custom-mug",
          imageCount: hasWrapArtwork ? 1 : uploadedImageCount,
          quantity,
        },
      });

      toast.success(getText("Added to cart!", "Ajoute au panier!"));
      void trackEvent("add_to_cart", {
        item_name: "Custom Mug",
        item_category: "Mugs",
        quantity,
      });
    } catch {
      toast.error(getText("Something went wrong", "Erreur"));
    }
  };

  const handleOrderNow = async () => {
    if (isOrdering) return;
    setIsOrdering(true);
    try {
      setOrderNowStatus(getText("Creating order...", "Creation de la commande..."));
      const draft = await createDraft({ cupType, currency, quantity });
      setOrderNowStatus(
        getText("Redirecting to payment...", "Redirection vers le paiement...")
      );
      router.push(`/checkout?orderId=${encodeURIComponent(draft.orderId)}`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : getText("Checkout failed", "Echec du paiement");
      setOrderNowStatus(null);
      toast.error(message);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070807] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(118,185,0,0.08),transparent_40%),linear-gradient(180deg,#0b0d0b_0%,#050505_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(118,185,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(118,185,0,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <div className="relative z-10">
        <header className="fixed inset-x-0 top-0 z-50 border-b border-primary/10 bg-[#090b09]/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="rounded-xl border border-primary/15 bg-white/[0.03] p-2 text-primary"
              >
                <Menu className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-3xl font-black tracking-[-0.06em] text-primary"
              >
                HOTZY
              </button>
            </div>

            <nav className="hidden items-center gap-8 text-[11px] font-bold uppercase tracking-[0.28em] text-white/55 md:flex">
              <button type="button" onClick={() => router.push("/")} className="hover:text-primary">
                Home
              </button>
              <button
                type="button"
                onClick={() => router.push("/shop")}
                className="hover:text-primary"
              >
                Catalog
              </button>
              <span className="text-primary">Design</span>
              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="hover:text-primary"
              >
                Cart
              </button>
            </nav>

            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="rounded-xl border border-primary/15 bg-white/[0.03] p-2 text-primary"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="px-4 pb-52 pt-20 md:px-6 md:pb-10">
          <div className="mx-auto grid max-w-[1700px] gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
            <aside className="hidden">
              <div className="rounded-[28px] border border-primary/10 bg-[#111411]/85 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="mb-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary/80">
                    Customization Lab
                  </div>
                  <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-white">
                    Craft Your Mug
                  </h1>
                </div>

                <div className="space-y-6">
                  <section>
                    <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">
                      <Palette className="h-4 w-4 text-primary" />
                      Base Color
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCupType("hotzy")}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          cupType === "hotzy"
                            ? "border-primary bg-primary/14 text-primary"
                            : "border-white/8 bg-white/[0.03] text-white/70"
                        }`}
                      >
                        <div className="text-xs font-bold uppercase tracking-[0.18em]">Hotzy</div>
                        <div className="mt-1 text-xs text-white/45">Black signature mug</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCupType("standard")}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          cupType === "standard"
                            ? "border-primary bg-primary/14 text-primary"
                            : "border-white/8 bg-white/[0.03] text-white/70"
                        }`}
                      >
                        <div className="text-xs font-bold uppercase tracking-[0.18em]">Standard</div>
                        <div className="mt-1 text-xs text-white/45">White classic mug</div>
                      </button>
                    </div>
                  </section>

                  <section id="hidden-upload-panel">
                    <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      Visual Assets
                    </div>
                    <div className="mb-3 grid grid-cols-2 gap-2 rounded-2xl border border-primary/15 bg-black/35 p-1">
                      <button
                        type="button"
                        onClick={() => setUploadPrintMode("sections")}
                        className={`rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] ${
                          uploadPrintMode === "sections"
                            ? "bg-primary text-black"
                            : "text-white/65"
                        }`}
                      >
                        Sections
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadPrintMode("full-wrap")}
                        className={`rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] ${
                          uploadPrintMode === "full-wrap"
                            ? "bg-primary text-black"
                            : "text-white/65"
                        }`}
                      >
                        Full Coverage
                      </button>
                    </div>
                    <div
                      className={`rounded-[24px] border border-dashed p-5 text-center transition ${
                        isDragging
                          ? "border-primary bg-primary/10"
                          : "border-primary/20 bg-black/30"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="block cursor-pointer"
                        onClick={() => {
                          void track("design_upload_start", {
                            cup_type: cupType,
                            section: uploadPrintMode === "full-wrap" ? "full_wrap" : activeSection,
                            print_mode: uploadPrintMode,
                            method: "picker",
                          });
                        }}
                      >
                        <Upload className="mx-auto h-9 w-9 text-primary" />
                        <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                          {isFullCoverageUploadMode ? "Full Coverage" : `Section ${activeSectionNumber}`}
                        </div>
                        <p className="mt-3 text-sm font-semibold text-white">Upload image</p>
                        <p className="mt-1 text-xs text-white/45">
                          {isFullCoverageUploadMode
                            ? "One image wraps the entire mug body."
                            : "Uploads apply to the selected section."}
                        </p>
                      </label>
                    </div>
                  </section>

                  {!hasTemplateWrap && (hasUploadWrap || (!hasWrapArtwork && currentSectionImage)) && (
                    <section>
                      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">
                        <Move className="h-4 w-4 text-primary" />
                        {hasUploadWrap ? "Wrap Scale" : "Placement"}
                      </div>
                      <div className="rounded-[24px] border border-white/8 bg-black/25 p-4">
                        <div className="mb-4 flex items-center justify-between text-xs text-white/65">
                          <span>Scale Image</span>
                          <button
                            type="button"
                            onClick={resetPositionControls}
                            className="font-semibold text-primary"
                          >
                            Reset
                          </button>
                        </div>
                        <div>
                          <div className="mb-2 flex items-center justify-between text-xs text-white/65">
                            <span>Size on mug</span>
                            <span>{Math.round(currentImageScale * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="2"
                            step="0.01"
                            value={currentImageScale}
                            onChange={(e) => updateImageScale(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>

                        {!hasUploadWrap && (
                          <div className="mt-4 flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => moveImage("left")}
                              className="rounded-xl border border-primary/25 bg-primary/10 p-3 text-primary"
                            >
                              <ArrowLeft className="h-4 w-4" />
                            </button>
                            <div className="min-w-16 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-center text-[11px] text-white/55">
                              {imagePosition.x.toFixed(2)}
                              <br />
                              {imagePosition.y.toFixed(2)}
                            </div>
                            <button
                              type="button"
                              onClick={() => moveImage("right")}
                              className="rounded-xl border border-primary/25 bg-primary/10 p-3 text-primary"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        {!hasUploadWrap && (
                          <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between text-xs text-white/65">
                            <span className="flex items-center gap-2">
                              <RotateCw className="h-3.5 w-3.5 text-primary" />
                              Rotation
                            </span>
                            <span>{imageRotation.toFixed(0)}°</span>
                          </div>
                          <input
                            type="range"
                            min="-45"
                            max="45"
                            step="1"
                            value={imageRotation}
                            onChange={(e) => setImageRotation(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                    <div>
                      <div className="text-xs font-semibold text-white">Quantity</div>
                      <div className="mt-0.5 text-[11px] text-white/45">
                        {unitDisplayPrice} each
                      </div>
                    </div>
                    <div className="flex items-center rounded-full border border-primary/20 bg-black/35 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-primary disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={999}
                        value={quantity}
                        onChange={(event) => updateQuantity(Number(event.target.value))}
                        className="h-8 w-14 bg-transparent text-center text-sm font-black text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        aria-label="Quantity"
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-black"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleOrderNow}
                    disabled={isOrdering}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-[#a5ec32] px-4 py-4 text-sm font-black uppercase tracking-[0.24em] text-black shadow-[0_0_26px_rgba(148,218,50,0.25)] disabled:opacity-70"
                  >
                    Finish Design
                    <Sparkles className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/25 bg-primary/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-primary"
                  >
                    <Package className="h-4 w-4" />
                    Add To Cart
                  </button>
                </div>
              </div>
            </aside>

            <section id="preview-panel" className="relative scroll-mt-20 overflow-hidden rounded-[24px] border border-primary/10 bg-[#080908] shadow-[0_32px_120px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(148,218,50,0.12),transparent_40%)]" />
              <div className="absolute inset-x-0 bottom-0 h-[36%] bg-[linear-gradient(rgba(118,185,0,0.16)_2px,transparent_2px),linear-gradient(90deg,rgba(118,185,0,0.16)_2px,transparent_2px)] bg-[size:84px_84px] [mask-image:linear-gradient(to_top,black_20%,transparent_90%)]" />

              <div className="relative z-10 flex min-h-[560px] flex-col md:min-h-[760px]">
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 md:px-8">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.26em]">
                    <div className="flex items-center gap-2 text-white/65">
                      <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(118,185,0,0.9)]" />
                      Live
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="text-primary">3D Preview</div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3">
                    <button
                      type="button"
                      onClick={() => setPreviewResetToken((token) => token + 1)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 transition hover:border-primary/40 hover:text-primary"
                    >
                      Reset View
                    </button>
                    <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                      {hasWrapArtwork ? "Wrap Active" : `Section ${activeSectionNumber}`}
                    </div>
                    <div className="hidden rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/65 md:block">
                      {displayPrice}
                    </div>
                  </div>
                </div>

                <div className="relative flex-1 px-4 pb-4 md:px-7 md:pb-7">
                  <div className="pointer-events-none absolute inset-x-10 bottom-16 top-24 hidden rounded-full border border-primary/8 md:block" />
                  <div className="pointer-events-none absolute inset-x-20 bottom-6 top-32 hidden rounded-full border border-primary/5 md:block" />

                  <div className="relative mx-auto h-full max-w-[900px] pt-3">
                    <MugViewer
                      customImage={selectedWrapArtwork?.image ?? null}
                      artworkSource={selectedWrapArtwork?.source}
                      customImageFit={selectedWrapArtwork?.fit}
                      artworkMode={selectedWrapArtwork?.mode}
                      dividedMode={!hasWrapArtwork}
                      cupType={cupType}
                      sectionImages={sectionImages}
                      sectionImageScales={sectionImageScales}
                      imagePosition={imagePosition}
                      imageScale={selectedWrapArtwork?.scale}
                      imageRotation={imageRotation}
                      focalX={selectedWrapArtwork?.focalX}
                      focalY={selectedWrapArtwork?.focalY}
                      wrapOffsetX={selectedWrapArtwork?.wrapOffsetX}
                      previewRotation={selectedWrapArtwork?.previewRotation}
                      previewResetToken={previewResetToken}
                    />

                    <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
                      <div className="flex items-center gap-3 rounded-full border border-primary/30 bg-black/55 px-4 py-2 backdrop-blur-md">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                          360° Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden border-t border-primary/10 bg-[#0b0d0b]/80 px-8 py-5 backdrop-blur-xl md:block xl:hidden">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCupType("hotzy")}
                      className={`h-10 w-10 rounded-full border-2 ${
                        cupType === "hotzy" ? "border-primary ring-4 ring-primary/20" : "border-white/20"
                      } bg-[#0d0d0f]`}
                    />
                    <button
                      type="button"
                      onClick={() => setCupType("standard")}
                      className={`h-10 w-10 rounded-full border-2 ${
                        cupType === "standard" ? "border-primary ring-4 ring-primary/20" : "border-white/20"
                      } bg-[#efefef]`}
                    />
                    <button
                      type="button"
                      onClick={() => scrollToCustomizerPanel("upload-panel", "nearest")}
                      className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToCustomizerPanel("templates-panel", "nearest")}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/65"
                    >
                      Templates
                    </button>
                    <button
                      type="button"
                      onClick={handleOrderNow}
                      className="ml-auto rounded-full bg-primary px-5 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-black"
                    >
                      Finish
                    </button>
                  </div>
                </div>

                <div id="templates-panel" className="scroll-mt-20 border-t border-primary/10 bg-[#090b09]/88 px-5 py-8 md:px-8 md:py-10">
                  <div className="mx-auto max-w-[1120px]">
                    <div className="text-center">
                      <div className="text-[12px] font-bold uppercase tracking-[0.28em] text-primary/75">
                        Choose A Ready Design
                      </div>
                      <p className="mx-auto mt-3 max-w-3xl text-sm text-white/50 md:text-base">
                        Templates apply without moving your current 3D view, so you can compare designs from the same angle.
                      </p>
                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
                      {customizerDesignTemplates.map((template) => {
                        const isSelected = selectedWrapArtwork?.image === template.image

                        return (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => handleTemplateSelect(template.image)}
                            className={`text-left transition ${
                              isSelected ? "scale-[1.02]" : "hover:-translate-y-1"
                            }`}
                          >
                            <div
                              className={`overflow-hidden rounded-[14px] border bg-black/35 shadow-[0_20px_60px_rgba(0,0,0,0.28)] ${
                                isSelected ? "border-primary shadow-[0_0_0_1px_rgba(148,218,50,0.35)]" : "border-white/8"
                              }`}
                            >
                              <img
                                src={template.image}
                                alt={getText(template.name, template.nameFr)}
                                className="aspect-[16/10] w-full bg-black object-contain"
                              />
                            </div>
                            <div className="px-2 pt-3 text-center">
                              <div className="text-sm leading-tight text-primary md:text-lg">
                                {getText(template.name, template.nameFr)}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {(hasTemplateWrap || hasUploadWrap) && (
                      <div className="mt-8 flex justify-center">
                        <button
                          type="button"
                          onClick={handleClearWrapArtwork}
                          className="rounded-full border border-primary/35 bg-primary/8 px-10 py-3 text-sm font-bold uppercase tracking-[0.28em] text-primary"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-4 xl:sticky xl:top-20">
              <div id="upload-panel" className="scroll-mt-20 rounded-[20px] border border-primary/10 bg-[#111411]/85 p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-primary/12 p-2.5 text-primary">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary/75">
                      Visual Assets
                    </div>
                    <h2 className="text-xl font-black text-white">
                      Upload Design
                    </h2>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-primary/15 bg-black/35 p-1">
                  <button
                    type="button"
                    onClick={() => setUploadPrintMode("sections")}
                    className={`rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] ${
                      uploadPrintMode === "sections"
                        ? "bg-primary text-black"
                        : "text-white/65"
                    }`}
                  >
                    Sections
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadPrintMode("full-wrap")}
                    className={`rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] ${
                      uploadPrintMode === "full-wrap"
                        ? "bg-primary text-black"
                        : "text-white/65"
                    }`}
                  >
                    Full Coverage
                  </button>
                </div>

                <div
                  className={`rounded-[16px] border border-dashed p-5 text-center transition ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-primary/20 bg-black/30"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    type="file"
                    id="visible-image-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="visible-image-upload"
                    className="block cursor-pointer"
                    onClick={() => {
                          void track("design_upload_start", {
                            cup_type: cupType,
                            section: uploadPrintMode === "full-wrap" ? "full_wrap" : activeSection,
                            print_mode: uploadPrintMode,
                            method: "picker",
                          });
                    }}
                  >
                    <Upload className="mx-auto h-9 w-9 text-primary" />
                    <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                      {isFullCoverageUploadMode ? "Full Coverage" : `Section ${activeSectionNumber}`}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">Upload image</p>
                    <p className="mt-1 text-xs text-white/45">
                      {isFullCoverageUploadMode
                        ? "Upload one image to cover the full mug."
                        : "Select a placement box, then upload or replace its image."}
                    </p>
                  </label>
                </div>

                {hasWrapArtwork && (
                  <div className="mt-4 rounded-[16px] border border-white/8 bg-black/25 p-4">
                    <div className="mb-3 flex items-center justify-between text-xs text-white/60">
                      <span className="flex items-center gap-2">
                        <Move className="h-3.5 w-3.5 text-primary" />
                        Size on mug
                      </span>
                      <button
                        type="button"
                        onClick={resetPositionControls}
                        className="font-semibold text-primary"
                      >
                        Reset
                      </button>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs text-white/60">
                        <span>Scale</span>
                        <span>{Math.round(currentImageScale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.01"
                        value={currentImageScale}
                        onChange={(e) => updateImageScale(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              {uploadPrintMode === "sections" && (
              <div className="rounded-[20px] border border-primary/10 bg-[#111411]/85 p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary/75">
                      Mug Sections
                    </div>
                    <h2 className="mt-1 text-xl font-black text-white">
                      Placement
                    </h2>
                  </div>
                  {!hasWrapArtwork && (
                    <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                      Active {activeSectionNumber}
                    </div>
                  )}
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs text-white/50">Mug type</span>
                  <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-black/35 p-1">
                    <button
                      type="button"
                      onClick={() => setCupType("hotzy")}
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                        cupType === "hotzy" ? "bg-primary text-black" : "text-white/65"
                      }`}
                    >
                      Hotzy
                    </button>
                    <button
                      type="button"
                      onClick={() => setCupType("standard")}
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                        cupType === "standard" ? "bg-primary text-black" : "text-white/65"
                      }`}
                    >
                      Standard
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {sectionOrder.map((section, index) => (
                    <button
                      key={section}
                      type="button"
                      onClick={() => setActiveSection(section)}
                      className={`relative aspect-square overflow-hidden rounded-[14px] border transition ${
                        activeSection === section
                          ? "border-primary bg-primary/8"
                          : "border-white/10 bg-black/30"
                      }`}
                    >
                      {sectionImages[section] ? (
                        <>
                          <img
                            src={sectionImages[section]!}
                            alt={`Section ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(section);
                            }}
                            className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center">
                          <span className="text-xl font-black text-white">{index + 1}</span>
                          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
                            Empty
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-white/45">
                  {hasTemplateWrap && selectedWrapMode === "full-wrap"
                    ? "Full-wrap template is covering the mug body. Manual sections stay available for upload work."
                    : hasUploadWrap
                      ? "Full coverage upload is wrapping the whole mug body."
                      : "Choose a placement box, then upload an image for that mug section."}
                </p>

                {!hasWrapArtwork && currentSectionType === "uploaded" && (
                  <button
                    type="button"
                    onClick={handleDuplicateToAll}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-primary"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate To All
                  </button>
                )}

                {!hasWrapArtwork && currentSectionImage && (
                  <div className="mt-4 rounded-[16px] border border-white/8 bg-black/25 p-4">
                    <div className="mb-3 flex items-center justify-between text-xs text-white/60">
                      <span className="flex items-center gap-2">
                        <Move className="h-3.5 w-3.5 text-primary" />
                        Size on mug
                      </span>
                      <button
                        type="button"
                        onClick={resetPositionControls}
                        className="font-semibold text-primary"
                      >
                        Reset
                      </button>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs text-white/60">
                        <span>Scale</span>
                        <span>{Math.round(currentImageScale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.01"
                        value={currentImageScale}
                        onChange={(e) => updateImageScale(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                      <>
                        <div className="mt-4 mb-2 flex items-center justify-between text-xs text-white/60">
                          <span className="flex items-center gap-2">
                            <RotateCw className="h-3.5 w-3.5 text-primary" />
                            Rotation
                          </span>
                          <span>{imageRotation.toFixed(0)}°</span>
                        </div>
                        <input
                          type="range"
                          min="-45"
                          max="45"
                          step="1"
                          value={imageRotation}
                          onChange={(e) => setImageRotation(parseFloat(e.target.value))}
                          className="w-full accent-primary"
                        />
                        <div className="mt-3 flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => moveImage("left")}
                            className="rounded-xl border border-primary/25 bg-primary/10 p-3 text-primary"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                          <div className="min-w-16 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-center text-[11px] text-white/55">
                            {imagePosition.x.toFixed(2)}
                            <br />
                            {imagePosition.y.toFixed(2)}
                          </div>
                          <button
                            type="button"
                            onClick={() => moveImage("right")}
                            className="rounded-xl border border-primary/25 bg-primary/10 p-3 text-primary"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                  </div>
                )}
              </div>
              )}
              <div id="finish-panel" className="scroll-mt-20 rounded-[20px] border border-primary/10 bg-[#111411]/85 p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-primary/12 p-2.5 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary/75">
                      Output
                    </div>
                    <h3 className="text-xl font-black text-white">
                      Finish Design
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                    <div>
                      <span className="text-white/50">Quantity</span>
                      <div className="mt-0.5 text-[11px] text-white/35">
                        {unitDisplayPrice} each
                      </div>
                    </div>
                    <div className="flex items-center rounded-full border border-primary/20 bg-black/35 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-primary disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={999}
                        value={quantity}
                        onChange={(event) => updateQuantity(Number(event.target.value))}
                        className="h-8 w-14 bg-transparent text-center text-sm font-black text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        aria-label="Quantity"
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-black"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                    <span className="text-white/50">Live price</span>
                    <span className="font-black text-primary">{displayPrice}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                    <span className="text-white/50">Print mode</span>
                    <span className="font-semibold text-white">
                      {hasWrapArtwork ? "Full Wrap" : "Section Layout"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                    <span className="text-white/50">Uploaded assets</span>
                    <span className="font-semibold text-white">
                      {hasWrapArtwork ? 1 : uploadedImageCount}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={handleOrderNow}
                    disabled={isOrdering}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-[#a5ec32] px-4 py-4 text-sm font-black uppercase tracking-[0.24em] text-black shadow-[0_0_26px_rgba(148,218,50,0.25)] disabled:opacity-70"
                  >
                    Finish Design
                    <Sparkles className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/8 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-primary"
                  >
                    <Package className="h-4 w-4" />
                    Add To Cart
                  </button>
                </div>

                {orderNowStatus && (
                  <div className="mt-3 text-center text-xs text-white/45">{orderNowStatus}</div>
                )}
              </div>
            </aside>
          </div>
        </main>

        <div className="fixed bottom-[5.75rem] left-0 z-40 w-full px-3 xl:hidden">
          <div className="mx-auto max-w-[calc(100vw-1.5rem)] rounded-[26px] border border-primary/12 bg-[#111411]/88 p-1.5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:max-w-md">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => scrollToCustomizerPanel("upload-panel", "center")}
                className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[20px] bg-primary/12 px-2 py-2.5 text-primary"
              >
                <Upload className="h-5 w-5" />
                <span className="text-[9px] font-black uppercase tracking-[0.18em]">Upload</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToCustomizerPanel("templates-panel", "start")}
                className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[20px] px-2 py-2.5 text-white/55"
              >
                <ImageIcon className="h-5 w-5" />
                <span className="text-[9px] font-black uppercase tracking-[0.18em]">Designs</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreviewResetToken((token) => token + 1);
                  scrollToCustomizerPanel("preview-panel", "start");
                }}
                className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[20px] px-2 py-2.5 text-white/55"
              >
                <RotateCw className="h-5 w-5" />
                <span className="text-[9px] font-black uppercase tracking-[0.18em]">View</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToCustomizerPanel("finish-panel", "center")}
                className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[20px] px-2 py-2.5 text-white/55"
              >
                <Pipette className="h-5 w-5" />
                <span className="text-[9px] font-black uppercase tracking-[0.18em]">Finish</span>
              </button>
              <button
                type="button"
                onClick={handleOrderNow}
                className="ml-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-primary text-black shadow-[0_0_24px_rgba(148,218,50,0.35)]"
              >
                <CheckCircle2 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-white/6 bg-[#090b09]/86 px-4 pb-5 pt-3 backdrop-blur-xl md:hidden">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex flex-col items-center gap-1 text-white/45"
          >
            <Home className="h-5 w-5" />
            <span className="text-[9px] font-bold uppercase tracking-[0.18em]">Home</span>
          </button>
          <button
            type="button"
            onClick={() => router.push("/shop")}
            className="flex flex-col items-center gap-1 text-white/45"
          >
            <LayoutGrid className="h-5 w-5" />
            <span className="text-[9px] font-bold uppercase tracking-[0.18em]">Catalog</span>
          </button>
          <div className="rounded-2xl border border-primary/20 bg-primary/8 px-4 py-2 text-primary">
            <div className="flex flex-col items-center gap-1">
              <Grid3x3 className="h-5 w-5" />
              <span className="text-[9px] font-bold uppercase tracking-[0.18em]">Design</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className="flex flex-col items-center gap-1 text-white/45"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-[9px] font-bold uppercase tracking-[0.18em]">Cart</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
