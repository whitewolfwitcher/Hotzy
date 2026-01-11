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
  }
}

const loadedMeasurementIds = new Set<string>();
const configuredMeasurementIds = new Set<string>();
let defaultConsentSet = false;
let jsInitialized = false;
let devConsentLogged = false;

const hasMeasurementId = (measurementId?: string): boolean =>
  typeof measurementId === "string" && measurementId.trim().length > 0;

const isBrowser = (): boolean =>
  typeof window !== "undefined" && typeof document !== "undefined";

export const isGaEnabled = (measurementId?: string): boolean =>
  isBrowser() && hasMeasurementId(measurementId);

export const ensureGaLoaded = (measurementId: string): void => {
  if (!isGaEnabled(measurementId)) {
    return;
  }

  const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    measurementId,
  )}`;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: GtagCommand) {
      window.dataLayer?.push(args);
    };

  if (!defaultConsentSet) {
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      wait_for_update: 500,
    });
    defaultConsentSet = true;
  }

  if (!loadedMeasurementIds.has(measurementId)) {
    if (!document.querySelector(`script[data-ga4-id="${measurementId}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = scriptSrc;
      script.dataset.ga4Id = measurementId;
      document.head.appendChild(script);
    }
    loadedMeasurementIds.add(measurementId);
  }

  if (!jsInitialized) {
    window.gtag("js", new Date());
    jsInitialized = true;
  }
};

export const grantAnalyticsConsent = (measurementId: string): void => {
  if (!isGaEnabled(measurementId)) {
    return;
  }

  ensureGaLoaded(measurementId);

  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("consent", "update", { analytics_storage: "granted" });

  if (!configuredMeasurementIds.has(measurementId)) {
    window.gtag("config", measurementId, { send_page_view: false });
    configuredMeasurementIds.add(measurementId);
  }

  if (process.env.NODE_ENV !== "production" && !devConsentLogged) {
    console.info("[ga] consent granted");
    devConsentLogged = true;
  }
};

export const pageView = (params: {
  page_location: string;
  page_path: string;
  page_title: string;
}, measurementId?: string): void => {
  if (!isGaEnabled(measurementId) || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "page_view", params);
};

export const getGaMeasurementId = (): string => GA4_MEASUREMENT_ID;
