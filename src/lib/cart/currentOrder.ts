const KEY = "hotzy_current_order_id";

export const getCurrentOrderId = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(KEY);
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
      window.localStorage.removeItem(KEY);
      return;
    }

    window.localStorage.setItem(KEY, id);
  } catch {
    // Ignore storage errors (private mode, quota, etc.).
  }
};

export const clearCurrentOrderId = (): void => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Ignore storage errors (private mode, quota, etc.).
  }
};
