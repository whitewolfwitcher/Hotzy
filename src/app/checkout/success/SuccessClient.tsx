"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clearCart } from "@/lib/cart/cart";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "missing"
  >(sessionId ? "loading" : orderId ? "success" : "missing");
  const [summary, setSummary] = useState<
    { amount_total?: number; currency?: string; payment_status?: string } | null
  >(null);

  useEffect(() => {
    if (!sessionId) {
      if (orderId) {
        clearCart();
      }
      return;
    }

    const run = async () => {
      try {
        const res = await fetch(`/api/stripe/session?session_id=${sessionId}`, {
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) {
          setStatus("error");
          return;
        }

        setSummary({
          amount_total: data.amount_total,
          currency: data.currency,
          payment_status: data.payment_status,
        });
        clearCart();
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    void run();
  }, [sessionId, orderId]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-lime-400">
          Payment Successful
        </h1>
        <p className="text-gray-300 mb-4">
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>

        {status === "missing" && (
          <p className="text-xs text-gray-400 mb-4">
            Missing Stripe session id.
          </p>
        )}

        {status === "error" && (
          <p className="text-xs text-red-400 mb-4">
            Unable to load payment details.
          </p>
        )}

        {status === "success" && summary && (
          <p className="text-xs text-gray-400 mb-4">
            Payment status: {summary.payment_status} | Total: {
              summary.amount_total && summary.currency
                ? `${(summary.amount_total / 100).toFixed(2)} ${summary.currency.toUpperCase()}`
                : "-"
            }
          </p>
        )}

        <p className="text-gray-500 mb-8 text-sm">
          A confirmation email will be sent to you shortly with your order
          details.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-md bg-lime-500 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-400"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
