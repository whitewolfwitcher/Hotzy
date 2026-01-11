"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import CheckoutProviders from "./providers";

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setErrorMessage(null);

    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${orderId}`;
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setErrorMessage(result.error.message ?? "Payment failed.");
      setProcessing(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      router.push(`/checkout/success?orderId=${orderId}`);
      return;
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {errorMessage && (
        <div className="text-sm text-red-400">{errorMessage}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-gradient-to-r from-primary via-[#9ACD32] to-primary text-black font-bold py-4 rounded-xl transition-all ${
          processing
            ? "opacity-70 cursor-not-allowed"
            : "hover:shadow-[0_0_30px_rgba(118,185,0,0.5)]"
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <Lock className="w-5 h-5" />
          {processing ? "Processing..." : "Pay now"}
        </span>
      </button>
    </form>
  );
}

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setStatus("Missing orderId.");
      return;
    }

    const run = async () => {
      setStatus("Preparing payment...");
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok || !data.clientSecret) {
        setStatus(data?.error || "Failed to create payment intent.");
        return;
      }

      setClientSecret(data.clientSecret);
      setStatus(null);
    };

    run();
  }, [orderId]);

  const options = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            appearance: {
              theme: "night",
              variables: {
                colorPrimary: "#76B900",
                colorBackground: "#0a0a0a",
                colorText: "#ffffff",
                colorDanger: "#ff4d4f",
                fontFamily: "Inter, ui-sans-serif, system-ui",
              },
            },
          }
        : undefined,
    [clientSecret]
  );

  return (
    <div className="min-h-screen bg-black">
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
              Complete your order
            </h1>
            <p className="text-muted-foreground">
              Secure payment powered by Stripe
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl p-6 md:p-8 shadow-xl">
            {!orderId && (
              <div className="text-sm text-red-400">
                Missing orderId in the URL.
              </div>
            )}

            {orderId && !clientSecret && status && (
              <div className="text-sm text-muted-foreground">{status}</div>
            )}

            {orderId && clientSecret && options && (
              <CheckoutProviders options={options}>
                <CheckoutForm orderId={orderId} />
              </CheckoutProviders>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
