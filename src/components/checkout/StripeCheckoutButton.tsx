"use client";

import { useState } from "react";

type StripeCheckoutButtonProps = {
  priceId: string;      // Stripe Price ID (test)
  quantity?: number;    // optional, default 1
  successPath?: string; // optional, default "/checkout/success"
  cancelPath?: string;  // optional, default "/checkout/cancel"
};

export function StripeCheckoutButton({
  priceId,
  quantity = 1,
  successPath = "/checkout/success",
  cancelPath = "/checkout/cancel",
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          quantity,
          successPath,
          cancelPath,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok || !data.url) {
        throw new Error(data?.message ?? "Failed to create Stripe session");
      }

      // Redirect browser to Stripe Checkout
      window.location.href = data.url as string;
    } catch (err: any) {
      console.error("Stripe checkout error:", err);
      setError(err?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-md bg-lime-500 px-4 py-3 font-semibold text-black hover:bg-lime-400 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Redirecting to Stripe..." : "Complete Order"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
