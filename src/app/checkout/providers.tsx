"use client";

import { useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export default function CheckoutProviders({
  children,
  options,
}: {
  children: React.ReactNode;
  options: StripeElementsOptions;
}) {
  const stripePromise = useMemo(() => {
    if (!stripeKey) return null;
    return loadStripe(stripeKey);
  }, []);

  if (!stripeKey) {
    return (
      <div className="text-sm text-red-400">
        Missing Stripe publishable key.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
