const DRAFT_KEY = "hotzy_current_order_draft";
const ORDER_UPDATED_EVENT = "hotzy:order-updated";

type DraftPayload = {
  sections?: Record<string, string | null | undefined>;
  cupType?: "hotzy" | "standard";
};

export const setCurrentOrderDraft = (payload: DraftPayload): void => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    window.dispatchEvent(new Event(ORDER_UPDATED_EVENT));
  } catch {
    // Ignore storage errors (private mode, quota, etc.).
  }
};

export const getCurrentOrderDraft = (): DraftPayload | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(DRAFT_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as DraftPayload;
  } catch {
    return null;
  }
};

export const getCurrentOrderDraftItemCount = (): number => {
  if (typeof window === "undefined") return 0;

  try {
    const stored = window.localStorage.getItem(DRAFT_KEY);
    if (!stored) return 0;

    const parsed = JSON.parse(stored) as DraftPayload;
    const sections = parsed?.sections;
    if (!sections) return 0;

    return Object.values(sections).filter(
      (value) => typeof value === "string" && value.trim().length > 0
    ).length;
  } catch {
    return 0;
  }
};
