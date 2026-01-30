"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `https://www.hotzy.ca/checkout/success?orderId=${encodeURIComponent(
          orderId
        )}`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="w-full bg-gradient-to-r from-primary via-[#9ACD32] to-primary text-black font-bold py-4 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(118,185,0,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (!orderId) return;

    const run = async () => {
      try {
        setStatus("Loading payment...");
        const res = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.clientSecret) {
          toast.error(data?.error || "Couldn't start checkout.");
          setStatus("");
          return;
        }
        setClientSecret(data.clientSecret);
        setStatus("");
      } catch {
        toast.error("Couldn't start checkout.");
        setStatus("");
      }
    };

    void run();
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-lime-400">
            Missing order
          </h1>
          <p className="text-gray-300 mb-6">No orderId was provided.</p>
          <Link
            href="/customizer"
            className="rounded-md bg-lime-500 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-400"
          >
            Go to Customizer
          </Link>
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
              Complete your payment
            </h1>
            <p className="text-muted-foreground">
              Secure payment powered by Stripe
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl p-6 md:p-8 shadow-xl">
            {status ? (
              <p className="text-sm text-muted-foreground">{status}</p>
            ) : null}
            {clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: { theme: "night" },
                }}
              >
                <CheckoutForm orderId={orderId} />
              </Elements>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
