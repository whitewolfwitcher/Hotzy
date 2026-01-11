import { getOrCreateClientId } from "@/lib/analytics/clientId";

const CONSENT_COOKIE = "hotzy_consent";

const logNonFatal = (err: unknown) => {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[analytics] non-fatal error", err);
  }
};

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") return null;
  try {
    const entry = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${name}=`));
    if (!entry) return null;
    return decodeURIComponent(entry.substring(name.length + 1));
  } catch (err) {
    logNonFatal(err);
    return null;
  }
};

const isConsentGranted = () => getCookieValue(CONSENT_COOKIE) === "granted";

export async function track(
  name: string,
  params?: Record<string, any>
): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    if (!name || !isConsentGranted()) return;

    if (process.env.NODE_ENV !== "production") {
      console.log("[track]", name, params ?? {});
    }

    const clientId = getOrCreateClientId();
    if (!clientId) return;

    const payload = {
      name,
      params,
      url: window.location.href,
      title: document.title,
      path: `${window.location.pathname}${window.location.search}`,
      clientId,
    };

    await fetch("/api/analytics/ga4/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    logNonFatal(err);
  }
}
