"use client";
import React from "react";

import { useCustomer, usePricingTable, ProductDetails } from "autumn-js/react";
import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import CheckoutDialog from "@/components/autumn/checkout-dialog";
import { getPricingTableContent } from "@/lib/autumn/pricing-table-content";
import type { Product, ProductItem } from "autumn-js";
import { Loader2, Check, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function PricingTable({
  productDetails,
}: {
  productDetails?: ProductDetails[];
}) {
  const { checkout } = useCustomer();
  const [isAnnual, setIsAnnual] = useState(false);
  const { products, isLoading, error } = usePricingTable({ productDetails });
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div> Something went wrong...</div>;
  }

  const intervals = Array.from(
    new Set(
      products?.map((p) => p.properties?.interval_group).filter((i) => !!i)
    )
  );

  const multiInterval = intervals.length > 1;

  const intervalFilter = (product: Product) => {
    if (!product.properties?.interval_group) {
      return true;
    }

    if (multiInterval) {
      if (isAnnual) {
        return product.properties?.interval_group === "year";
      } else {
        return product.properties?.interval_group === "month";
      }
    }

    return true;
  };

  return (
    <div className={cn("root")}>
      {products && (
        <PricingTableContainer
          products={products}
          isAnnualToggle={isAnnual}
          setIsAnnualToggle={setIsAnnual}
          multiInterval={multiInterval}
        >
          {products.filter(intervalFilter).map((product, index) => (
            <PricingCard
              key={index}
              productId={product.id}
              buttonProps={{
                disabled:
                  // allow managing current plan; only disable scheduled
                  product.scenario === "scheduled",

                onClick: async () => {
                  // Auth check per guidelines
                  if (!session?.user) {
                    if (!isPending) {
                      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                    }
                    return;
                  }

                  // Current plan: open billing portal
                  if (product.scenario === "active") {
                    const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
                    try {
                      const res = await fetch("/api/billing-portal", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                        body: JSON.stringify({
                          returnUrl: (() => {
                            if (typeof window === "undefined") return undefined;
                            const t = localStorage.getItem("bearer_token");
                            const u = new URL(window.location.href);
                            if (t) u.searchParams.set("token", t);
                            return u.toString();
                          })(),
                        }),
                      });
                      const data = await res.json();
                      const url = data?.url;
                      if (url) {
                        const isInIframe = typeof window !== "undefined" && window.self !== window.top;
                        if (isInIframe) {
                          window.parent?.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
                        } else {
                          window.open(url, "_blank", "noopener,noreferrer");
                        }
                      }
                    } catch (e) {
                      console.error(e);
                    }
                    return;
                  }

                  // New purchase / upgrade flow
                  if (product.id) {
                    const res = await checkout({
                      productId: product.id,
                      dialog: CheckoutDialog,
                      openInNewTab: true,
                      successUrl: (() => {
                        if (typeof window === "undefined") return undefined;
                        const token = localStorage.getItem("bearer_token");
                        const u = new URL(window.location.href);
                        if (token) u.searchParams.set("token", token);
                        return u.toString();
                      })(),
                      cancelUrl: (() => {
                        if (typeof window === "undefined") return undefined;
                        const token = localStorage.getItem("bearer_token");
                        const u = new URL(window.location.href);
                        if (token) u.searchParams.set("token", token);
                        return u.toString();
                      })(),
                    } as any);

                    const url = (res as any)?.data?.url;
                    if (url) {
                      const isInIframe = typeof window !== "undefined" && window.self !== window.top;
                      if (isInIframe) {
                        window.parent?.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
                      } else {
                        window.open(url, "_blank", "noopener,noreferrer");
                      }
                    }
                  } else if (product.display?.button_url) {
                    const url = product.display.button_url;
                    const isInIframe = typeof window !== "undefined" && window.self !== window.top;
                    if (isInIframe) {
                      window.parent?.postMessage(
                        { type: "OPEN_EXTERNAL_URL", data: { url } },
                        "*"
                      );
                    } else {
                      window.open(url, "_blank", "noopener,noreferrer");
                    }
                  }
                },
              }}
            />
          ))}
        </PricingTableContainer>
      )}
    </div>
  );
}

const PricingTableContext = createContext<{
  isAnnualToggle: boolean;
  setIsAnnualToggle: (isAnnual: boolean) => void;
  products: Product[];
  showFeatures: boolean;
}>({
  isAnnualToggle: false,
  setIsAnnualToggle: () => {},
  products: [],
  showFeatures: true,
});

export const usePricingTableContext = (componentName: string) => {
  const context = useContext(PricingTableContext);

  if (context === undefined) {
    throw new Error(`${componentName} must be used within <PricingTable />`);
  }

  return context;
};

export const PricingTableContainer = ({
  children,
  products,
  showFeatures = true,
  className,
  isAnnualToggle,
  setIsAnnualToggle,
  multiInterval,
}: {
  children?: React.ReactNode;
  products?: Product[];
  showFeatures?: boolean;
  className?: string;
  isAnnualToggle: boolean;
  setIsAnnualToggle: (isAnnual: boolean) => void;
  multiInterval: boolean;
}) => {
  if (!products) {
    throw new Error("products is required in <PricingTable />");
  }

  if (products.length === 0) {
    return <></>;
  }

  const hasRecommended = products?.some((p) => p.display?.recommend_text);
  return (
    <PricingTableContext.Provider
      value={{ isAnnualToggle, setIsAnnualToggle, products, showFeatures }}
    >
      <div
        className={cn(
          "flex items-center flex-col",
          hasRecommended && "!py-10"
        )}
      >
        {multiInterval && (
          <div
            className={cn(
              products.some((p) => p.display?.recommend_text) && "mb-8"
            )}
          >
            <AnnualSwitch
              isAnnualToggle={isAnnualToggle}
              setIsAnnualToggle={setIsAnnualToggle}
            />
          </div>
        )}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] w-full gap-2",
            className
          )}
        >
          {children}
        </div>
      </div>
    </PricingTableContext.Provider>
  );
};

interface PricingCardProps {
  productId: string;
  showFeatures?: boolean;
  className?: string;
  onButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonProps?: React.ComponentProps<"button">;
}

export const PricingCard = ({
  productId,
  className,
  buttonProps,
}: PricingCardProps) => {
  const { products, showFeatures } = usePricingTableContext("PricingCard");

  const product = products.find((p) => p.id === productId);

  if (!product) {
    throw new Error(`Product with id ${productId} not found`);
  }

  const { name, display: productDisplay } = product;

  const { buttonText } = getPricingTableContent(product);

  const isRecommended = productDisplay?.recommend_text ? true : false;
  const mainPriceDisplay = product.properties?.is_free
    ? {
        primary_text: "Free",
      }
    : product.items[0].display;

  const featureItems = product.properties?.is_free
    ? product.items
    : product.items.slice(1);

  const buttonLabel =
    product.scenario === "active"
      ? "Manage billing"
      : productDisplay?.button_text || buttonText;

  return (
    <div
      className={cn(
        "w-full h-full p-8 text-foreground border rounded-2xl shadow-xl max-w-xl relative overflow-hidden",
        "bg-gradient-to-br from-[#1A1A1A] to-black",
        isRecommended 
          ? "border-primary shadow-primary/20 lg:-translate-y-6 lg:h-[calc(100%+48px)] scale-105"
          : "border-primary/20 hover:border-primary/40",
        "transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Recommended badge */}
      {productDisplay?.recommend_text && (
        <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl flex items-center gap-1">
          <Crown className="w-3 h-3" />
          {productDisplay?.recommend_text}
        </div>
      )}
      
      <div
        className={cn(
          "flex flex-col h-full flex-grow",
          isRecommended && "lg:translate-y-6"
        )}
      >
        <div className="h-full">
          <div className="flex flex-col">
            <div className="pb-6">
              <h2 className="text-3xl font-black text-white mb-2 truncate">
                {productDisplay?.name || name}
              </h2>
              {productDisplay?.description && (
                <div className="text-sm text-light-gray">
                  <p className="line-clamp-2">
                    {productDisplay?.description}
                  </p>
                </div>
              )}
            </div>
            <div className="mb-6">
              <div className="py-4 border-y border-primary/20 bg-black/40 -mx-8 px-8">
                <div className="text-4xl font-black text-white">
                  {mainPriceDisplay?.primary_text}
                </div>
                {mainPriceDisplay?.secondary_text && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {mainPriceDisplay?.secondary_text}
                  </div>
                )}
              </div>
            </div>
          </div>
          {showFeatures && featureItems.length > 0 && (
            <div className="flex-grow mb-6">
              <PricingFeatureList
                items={featureItems}
                everythingFrom={product.display?.everything_from}
              />
            </div>
          )}
        </div>
        <div
          className={cn("mt-auto", isRecommended && "lg:-translate-y-12")}
        >
          <PricingCardButton
            recommended={productDisplay?.recommend_text ? true : false}
            {...buttonProps}
          >
            {buttonLabel}
          </PricingCardButton>
        </div>
      </div>
    </div>
  );
};

// Pricing Feature List
export const PricingFeatureList = ({
  items,
  everythingFrom,
  className,
}: {
  items: ProductItem[];
  everythingFrom?: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex-grow", className)}>
      {everythingFrom && (
        <p className="text-sm mb-4 text-muted-foreground font-medium">
          Everything from {everythingFrom}, plus:
        </p>
      )}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 text-sm"
          >
            <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-medium">{item.display?.primary_text}</span>
              {item.display?.secondary_text && (
                <span className="text-xs text-muted-foreground mt-0.5">
                  {item.display?.secondary_text}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pricing Card Button
export interface PricingCardButtonProps extends React.ComponentProps<"button"> {
  recommended?: boolean;
  buttonUrl?: string;
}

export const PricingCardButton = React.forwardRef<
  HTMLButtonElement,
  PricingCardButtonProps
>(({ recommended, children, className, onClick, ...props }, ref) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    try {
      await onClick?.(e);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={cn(
        "w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 relative overflow-hidden",
        recommended 
          ? "bg-gradient-to-r from-primary via-[#9ACD32] to-primary text-black hover:shadow-[0_0_30px_rgba(118,185,0,0.5)]"
          : "bg-card border-2 border-primary/30 text-white hover:border-primary hover:bg-primary/10",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
      ref={ref}
      disabled={loading || props.disabled}
      onClick={handleClick}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin mx-auto" />
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
});
PricingCardButton.displayName = "PricingCardButton";

// Annual Switch
export const AnnualSwitch = ({
  isAnnualToggle,
  setIsAnnualToggle,
}: {
  isAnnualToggle: boolean;
  setIsAnnualToggle: (isAnnual: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-8 p-3 bg-card border border-border rounded-full">
      <span className={cn(
        "text-sm font-medium transition-colors",
        !isAnnualToggle ? "text-white" : "text-muted-foreground"
      )}>
        Monthly
      </span>
      <Switch
        id="annual-billing"
        checked={isAnnualToggle}
        onCheckedChange={setIsAnnualToggle}
      />
      <span className={cn(
        "text-sm font-medium transition-colors",
        isAnnualToggle ? "text-white" : "text-muted-foreground"
      )}>
        Annual
      </span>
      {isAnnualToggle && (
        <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded-full">
          Save 20%
        </span>
      )}
    </div>
  );
};

export const RecommendedBadge = ({ recommended }: { recommended: string }) => {
  return (
    <div className="bg-secondary absolute border text-muted-foreground text-sm font-medium lg:rounded-full px-3 lg:py-0.5 lg:top-4 lg:right-4 top-[-1px] right-[-1px] rounded-bl-lg">
      {recommended}
    </div>
  );
};

export { PricingTable };