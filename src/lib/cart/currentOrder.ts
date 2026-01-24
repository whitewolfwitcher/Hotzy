const STORAGE_KEY = "hotzy_current_order_id";
const DRAFT_KEY = "hotzy_current_order_draft";

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

export const clearCurrentOrderId = (): void => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Ignore storage errors (private mode, quota, etc.).
  }
};

export const getCurrentOrderItemCount = (): number => {
  if (typeof window === "undefined") return 0;

  try {
    const stored = window.localStorage.getItem(DRAFT_KEY);
    if (!stored) return 0;

    const parsed = JSON.parse(stored) as {
      sections?: Record<string, string | null | undefined>;
    };
    const sections = parsed?.sections;
    if (!sections) return 0;

    return Object.values(sections).filter(
      (value) => typeof value === "string" && value.trim().length > 0
    ).length;
  } catch {
    return 0;
  }
};
