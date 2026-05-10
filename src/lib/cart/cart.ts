const STORAGE_KEY = "hotzy_cart_v1";
const CART_EVENT = "hotzy:cart-updated";

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  qty: number;
  meta?: Record<string, unknown>;
};

type CartState = {
  items: CartItem[];
};

const readCart = (): CartState => {
  if (typeof window === "undefined") return { items: [] };

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return { items: [] };
    const parsed = JSON.parse(stored) as CartState;
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return { items: parsed.items };
  } catch {
    return { items: [] };
  }
};

const writeCart = (state: CartState) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event(CART_EVENT));
  } catch {
    // Ignore storage errors.
  }
};

export const getCart = (): CartItem[] => readCart().items;

export const addItem = (item: CartItem) => {
  const cart = readCart();
  const existing = cart.items.find((entry) => entry.id === item.id);
  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.items.push(item);
  }
  writeCart(cart);
};

export const removeItem = (id: string) => {
  const cart = readCart();
  cart.items = cart.items.filter((item) => item.id !== id);
  writeCart(cart);
};

export const clearCart = () => {
  writeCart({ items: [] });
};

export const getItemCount = () => {
  return readCart().items.reduce((sum, item) => sum + item.qty, 0);
};

export const subscribeCart = (handler: () => void) => {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(CART_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CART_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};
