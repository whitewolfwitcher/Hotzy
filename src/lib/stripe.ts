// src/lib/stripe.ts
import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  if (stripeInstance) return stripeInstance;

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY environment variable. Set it in your .env file."
    );
  }

  stripeInstance = new Stripe(stripeSecretKey, {
    apiVersion: "2025-10-29.clover",
  });

  return stripeInstance;
};
