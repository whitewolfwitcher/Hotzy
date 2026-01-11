const CLIENT_ID_COOKIE = "hotzy_ga_cid";

const generateClientId = () =>
  `${Date.now()}.${Math.floor(Math.random() * 1_000_000_000)}`;

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`));
  if (!entry) return null;
  return decodeURIComponent(entry.substring(name.length + 1));
};

const setCookieValue = (name: string, value: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
};

export const getOrCreateClientId = () => {
  if (typeof window === "undefined") return null;
  const existing = getCookieValue(CLIENT_ID_COOKIE);
  if (existing) return existing;
  const generated = generateClientId();
  setCookieValue(CLIENT_ID_COOKIE, generated);
  return generated;
};
