import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout Cancelled | Hotzy",
};

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-yellow-400">
          Payment Cancelled
        </h1>
        <p className="text-gray-300 mb-4">
          Your payment was not completed. You can review your order and try
          again.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/checkout"
            className="rounded-md bg-lime-500 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-400"
          >
            Return to Checkout
          </Link>
          <Link
            href="/"
            className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-zinc-900"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
