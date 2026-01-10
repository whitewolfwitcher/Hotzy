const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "";

type GtagCommand =
  | ["js", Date]
  | ["config", string, Record<string, unknown>]
  | ["event", string, Record<string, unknown>];

declare global {
  interface Window {
    dataLayer?: Array<unknown>;
    gtag?: (...args: GtagCommand) => void;
  }
}

let gaInitialized = false;

const hasMeasurementId = (): boolean => GA4_MEASUREMENT_ID.trim().length > 0;

export const isGaEnabled = (): boolean =>
  typeof window !== "undefined" && hasMeasurementId();

export const initGa = (): void => {
  if (!isGaEnabled() || gaInitialized) {
    return;
  }

  const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    GA4_MEASUREMENT_ID,
  )}`;

  if (!document.querySelector(`script[data-ga4-id="${GA4_MEASUREMENT_ID}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = scriptSrc;
    script.dataset.ga4Id = GA4_MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: GtagCommand) {
      window.dataLayer?.push(args);
    };
  window.gtag("js", new Date());
  window.gtag("config", GA4_MEASUREMENT_ID, { send_page_view: false });

  gaInitialized = true;
};

export const pageView = (params: {
  page_location: string;
  page_path: string;
  page_title: string;
}): void => {
  if (!isGaEnabled() || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "page_view", params);
};
