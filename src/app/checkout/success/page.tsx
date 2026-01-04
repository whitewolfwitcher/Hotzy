import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Confirmed | Hotzy",
};

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: { orderId?: string };
}) {
  const orderId = searchParams?.orderId;
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
        {orderId && (
          <p className="text-xs text-gray-400 mb-4">Order ID: {orderId}</p>
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
