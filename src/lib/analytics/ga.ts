const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "";

type GtagCommand =
  | ["js", Date]
  | ["config", string, Record<string, unknown>]
  | ["event", string, Record<string, unknown>]
  | ["consent", "default" | "update", Record<string, unknown>];

declare global {
  interface Window {
    dataLayer?: Array<unknown>;
    gtag?: (...args: GtagCommand) => void;
    __hotzyGaConfigured?: boolean;
  }
}

let defaultConsentSet = false;
let jsInitialized = false;
let devConsentLogged = false;

const hasMeasurementId = (measurementId?: string | null): boolean =>
  typeof measurementId === "string" && measurementId.trim().length > 0;

const isBrowser = (): boolean =>
  typeof window !== "undefined" && typeof document !== "undefined";

const isGaEnabled = (measurementId?: string | null): boolean =>
  isBrowser() && hasMeasurementId(measurementId);

export const getGaMeasurementId = (): string | null => {
  const trimmed = GA4_MEASUREMENT_ID.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const ensureGaBaseLoaded = (measurementId: string): void => {
  if (!isGaEnabled(measurementId)) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: GtagCommand) {
      window.dataLayer?.push(args);
    };

  if (!defaultConsentSet && typeof window.gtag === "function") {
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      wait_for_update: 500,
    });
    defaultConsentSet = true;
  }

  if (!document.getElementById("hotzy-ga4")) {
    const script = document.createElement("script");
    script.async = true;
    script.id = "hotzy-ga4";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      measurementId,
    )}`;
    document.head.appendChild(script);
  }

  if (!jsInitialized && typeof window.gtag === "function") {
    window.gtag("js", new Date());
    jsInitialized = true;
  }
};

export const grantGaAnalytics = (measurementId: string): void => {
  if (!isGaEnabled(measurementId)) {
    return;
  }

  ensureGaBaseLoaded(measurementId);

  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("consent", "update", { analytics_storage: "granted" });

  if (!window.__hotzyGaConfigured) {
    window.gtag("config", measurementId, {
      send_page_view: false,
      transport_type: "beacon",
    });
    window.__hotzyGaConfigured = true;
  }

  if (process.env.NODE_ENV !== "production" && !devConsentLogged) {
    console.log("[ga] consent granted + configured");
    devConsentLogged = true;
  }
};

export const trackGaPageView = (measurementId: string, url: string): void => {
  if (!isGaEnabled(measurementId) || typeof window.gtag !== "function") {
    return;
  }

  const location = new URL(url);
  window.gtag("event", "page_view", {
    send_to: measurementId,
    page_location: url,
    page_path: `${location.pathname}${location.search}`,
    page_title: document.title,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("[ga] page_view", window.location.pathname);
  }
};
