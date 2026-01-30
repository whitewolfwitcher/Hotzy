"use client";
import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ConvexUploadTestPage() {
  const createDraft = useMutation(api.orders.createDraft);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const attachWrap = useMutation(api.orders.attachWrap);
  const generatePdfForOrder = useAction(api.print.generatePdfForOrder);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [wrapFileId, setWrapFileId] = useState<string | null>(null);
  const [pdfFileId, setPdfFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleFile = async (file: File) => {
    setError(null);
    setPdfFileId(null);
    setStatus("Creating draft order...");
    const draft = await createDraft({ cupType: "hotzy", currency: "CAD" });
    setOrderId(draft.orderId as string);

    setStatus("Requesting upload URL...");
    const uploadUrl = await generateUploadUrl({});

    setStatus("Uploading file...");
    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      body: file,
    });
    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.status}`);
    }
    const uploadJson = (await uploadRes.json()) as { storageId?: string; fileId?: string };
    const storageId = uploadJson.storageId ?? uploadJson.fileId;
    if (!storageId) {
      throw new Error("No storageId returned from upload");
    }
    setWrapFileId(storageId);

    setStatus("Attaching wrap to order...");
    await attachWrap({ orderId: draft.orderId, wrapFileId: storageId });
    setStatus("Upload complete");
  };

  const handleGeneratePdf = async () => {
    if (!orderId) return;
    setError(null);
    setIsGenerating(true);
    setStatus("Generating PDF...");
    try {
      const result = await generatePdfForOrder({ orderId });
      setPdfFileId(result.pdfFileId as string);
      setStatus("PDF ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Convex Upload Test</h1>
      <p>Upload a PNG to attach it to a draft order.</p>
      <input
        type="file"
        accept="image/png"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          handleFile(file).catch((err) => setError(err.message));
        }}
      />
      <div style={{ marginTop: 16 }}>
        <div>Status: {status || "idle"}</div>
        <div>OrderId: {orderId ?? "-"}</div>
        <div>WrapFileId: {wrapFileId ?? "-"}</div>
        <div>PdfFileId: {pdfFileId ?? "-"}</div>
        <button
          type="button"
          style={{ marginTop: 12 }}
          disabled={!orderId || !wrapFileId || isGenerating}
          onClick={() => {
            handleGeneratePdf();
          }}
        >
          {isGenerating ? "Generating..." : "Generate PDF"}
        </button>
        {pdfFileId ? (
          <div style={{ marginTop: 8 }}>
            <a
              href={`/api/convex-file?id=${encodeURIComponent(pdfFileId)}`}
              target="_blank"
              rel="noreferrer"
            >
              Download PDF
            </a>
          </div>
        ) : null}
        {error ? <pre style={{ color: "crimson" }}>{error}</pre> : null}
      </div>
    </main>
  );
}
