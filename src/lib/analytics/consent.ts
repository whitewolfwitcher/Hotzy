export type ConsentState = "unknown" | "granted" | "denied";

export const CONSENT_STORAGE_KEY = "hotzy_consent_v1";
export const CONSENT_EVENT_NAME = "hotzy-consent-changed";

const isConsentState = (value: string | null): value is ConsentState =>
  value === "unknown" || value === "granted" || value === "denied";

export function readConsent(): ConsentState {
  if (typeof window === "undefined") {
    return "unknown";
  }

  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return isConsentState(value) ? value : "unknown";
  } catch {
    return "unknown";
  }
}

export function writeConsent(next: ConsentState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, next);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT_NAME, { detail: next }));
  } catch {
    // Ignore storage failures in restricted environments.
  }
}

export function subscribeConsentChange(
  handler: (state: ConsentState) => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onCustomEvent = (event: Event) => {
    const detail = (event as CustomEvent<ConsentState>).detail;
    if (detail && isConsentState(detail)) {
      handler(detail);
      return;
    }

    handler(readConsent());
  };

  const onStorageEvent = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) {
      handler(readConsent());
    }
  };

  window.addEventListener(CONSENT_EVENT_NAME, onCustomEvent);
  window.addEventListener("storage", onStorageEvent);

  return () => {
    window.removeEventListener(CONSENT_EVENT_NAME, onCustomEvent);
    window.removeEventListener("storage", onStorageEvent);
  };
}
