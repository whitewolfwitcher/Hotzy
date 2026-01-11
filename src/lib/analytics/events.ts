import { getOrCreateClientId } from "@/lib/analytics/clientId";

const CONSENT_COOKIE = "hotzy_consent";

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`));
  if (!entry) return null;
  return decodeURIComponent(entry.substring(name.length + 1));
};

const isConsentGranted = () => getCookieValue(CONSENT_COOKIE) === "granted";

export async function trackEvent(
  name: string,
  params?: Record<string, any>
): Promise<void> {
  if (typeof window === "undefined") return;
  if (!name || !isConsentGranted()) return;

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

  try {
    await fetch("/api/analytics/ga4/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Best-effort analytics: never block UX.
  }
}
