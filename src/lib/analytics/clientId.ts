const CLIENT_ID_COOKIE = "hotzy_ga_cid";

const logNonFatal = (err: unknown) => {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[analytics] non-fatal error", err);
  }
};

const generateClientId = () =>
  `${Date.now()}.${Math.floor(Math.random() * 1_000_000_000)}`;

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

const setCookieValue = (name: string, value: string) => {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
  } catch (err) {
    logNonFatal(err);
  }
};

export const getOrCreateClientId = () => {
  if (typeof window === "undefined") return null;
  try {
    const existing = getCookieValue(CLIENT_ID_COOKIE);
    if (existing) return existing;
    const generated = generateClientId();
    setCookieValue(CLIENT_ID_COOKIE, generated);
    return generated;
  } catch (err) {
    logNonFatal(err);
    return null;
  }
};
