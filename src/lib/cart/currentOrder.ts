const STORAGE_KEY = "hotzy_current_order_id";

export const getCurrentOrderId = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const value = stored.trim();
    return value.length > 0 ? value : null;
  } catch {
    return null;
  }
};

export const setCurrentOrderId = (id: string): void => {
  if (typeof window === "undefined") return;

  try {
    if (!id) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Ignore storage errors (private mode, quota, etc.).
  }
};
