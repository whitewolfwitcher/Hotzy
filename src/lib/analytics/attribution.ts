type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
};

const ATTRIB_COOKIE = "hotzy_attrib";
const COOKIE_MAX_AGE = 2592000;

const logNonFatal = (err: unknown) => {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[analytics] suppressed error", err);
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

export const readAttributionFromUrl = (url: string): Attribution => {
  try {
    const parsed = new URL(url, "https://example.com");
    const params = parsed.searchParams;
    const attribution: Attribution = {};
    const keys: (keyof Attribution)[] = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "gclid",
      "fbclid",
    ];

    for (const key of keys) {
      const value = params.get(key);
      if (value) {
        attribution[key] = value;
      }
    }

    return attribution;
  } catch {
    return {};
  }
};

export const getAttribution = (): Attribution | null => {
  if (typeof document === "undefined") return null;
  const raw = getCookieValue(ATTRIB_COOKIE);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Attribution;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

export const setAttribution = (obj: Attribution) => {
  if (typeof document === "undefined") return;
  try {
    const encoded = encodeURIComponent(JSON.stringify(obj));
    document.cookie = `${ATTRIB_COOKIE}=${encoded}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
  } catch (err) {
    logNonFatal(err);
  }
};

export const captureAttribution = () => {
  if (typeof window === "undefined") return;
  try {
    const fromUrl = readAttributionFromUrl(window.location.href);
    const hasParams = Object.keys(fromUrl).length > 0;
    const referrer = document.referrer || undefined;

    if (hasParams || referrer) {
      const payload: Attribution = { ...fromUrl };
      if (referrer) {
        payload.referrer = referrer;
      }
      setAttribution(payload);
    }
  } catch (err) {
    logNonFatal(err);
  }
};
