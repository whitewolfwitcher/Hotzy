const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    __hotzyGaBaseLoaded?: boolean;
    __hotzyGaConfigured?: boolean;
  }
}

let devConsentLogged = false;

export const getGaMeasurementId = (): string | null => {
  const trimmed = GA4_MEASUREMENT_ID.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const ensureGaBaseLoaded = (measurementId: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (window.__hotzyGaBaseLoaded) {
    return;
  }

  if (typeof measurementId !== "string" || measurementId.trim().length === 0) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: any[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    wait_for_update: 500,
  });

  if (typeof document !== "undefined" && !document.getElementById("hotzy-ga4")) {
    const script = document.createElement("script");
    script.async = true;
    script.id = "hotzy-ga4";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      measurementId,
    )}`;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.__hotzyGaBaseLoaded = true;
};

export const grantGaAnalytics = (measurementId: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  ensureGaBaseLoaded(measurementId);

  if (window.__hotzyGaConfigured || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("consent", "update", { analytics_storage: "granted" });

  window.gtag("config", measurementId, {
    send_page_view: false,
    transport_type: "beacon",
  });
  window.__hotzyGaConfigured = true;

  if (process.env.NODE_ENV !== "production" && !devConsentLogged) {
    console.log("[ga] consent granted + configured");
    devConsentLogged = true;
  }
};

export const trackGaPageView = (measurementId: string, url: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.__hotzyGaConfigured || typeof window.gtag !== "function") {
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
