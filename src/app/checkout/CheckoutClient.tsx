"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  getCart,
  getItemCount,
  subscribeCart,
  clearCart,
} from "@/lib/cart/cart";

const formatMoney = (amountCents: number, currency: string) => {
  const value = amountCents / 100;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(value);
};

export default function CheckoutClient() {
  const [items, setItems] = useState(getCart());
  const itemCount = useMemo(() => getItemCount(), [items]);

  useEffect(() => {
    const update = () => setItems(getCart());
    update();
    const unsubscribe = subscribeCart(update);
    return () => unsubscribe();
  }, []);

  const totalCents = items.reduce(
    (sum, item) => sum + item.priceCents * item.qty,
    0
  );

  const currency = items[0]?.currency ?? "CAD";

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) {
        toast.error(data?.error || "Couldnâ€™t start checkout.");
        return;
      }

      window.location.href = data.url as string;
    } catch {
      toast.error("Couldnâ€™t start checkout.");
    }
  };

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-lime-400">
            Your cart is empty
          </h1>
          <p className="text-gray-300 mb-6">
            Add a mug design to your cart to continue.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/customizer"
              className="rounded-md bg-lime-500 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-400"
            >
              Go to Customizer
            </Link>
            <Link
              href="/shop"
              className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-zinc-900"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-border bg-[#0a0a0a]">
        <div className="container py-6">
          <Link
            href="/customizer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to customizer
          </Link>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Review your cart
            </h1>
            <p className="text-muted-foreground">
              Secure payment powered by Stripe Checkout
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-white/10 pb-4"
                >
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty {item.qty}
                    </p>
                  </div>
                  <div className="text-sm text-white">
                    {formatMoney(item.priceCents * item.qty, item.currency)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6 text-lg font-semibold">
              <span>Total</span>
              <span>{formatMoney(totalCents, currency)}</span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-6 w-full bg-gradient-to-r from-primary via-[#9ACD32] to-primary text-black font-bold py-4 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(118,185,0,0.5)]"
            >
              Pay with Stripe
            </button>

            <button
              type="button"
              onClick={() => {
                clearCart();
                toast.success("Cart cleared");
              }}
              className="mt-3 w-full border border-white/20 text-white/80 py-3 rounded-xl hover:border-white/40"
            >
              Clear cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
