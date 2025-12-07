// src/app/api/checkout/create-payment-intent/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

type ShippingInfo = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

function isValidEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | {
          items?: CartItem[];
          shippingInfo?: ShippingInfo;
        }
      | null;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { items, shippingInfo } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    const requiredFields: (keyof ShippingInfo)[] = [
      "fullName",
      "email",
      "address",
      "city",
      "state",
      "zipCode",
    ];

    const missingFields = requiredFields.filter(
      (field) => !shippingInfo || !shippingInfo[field]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Missing shipping information",
          missingFields,
        },
        { status: 400 }
      );
    }

    // Compute subtotal from cart
    let subtotal = 0;
    for (const item of items) {
      const unitPrice = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      if (unitPrice <= 0 || qty <= 0) continue;
      subtotal += unitPrice * qty;
    }

    if (subtotal <= 0) {
      return NextResponse.json(
        { ok: false, message: "Invalid cart total" },
        { status: 400 }
      );
    }

    // Apply same shipping & tax logic as frontend
    const shipping = subtotal > 50 ? 0 : 5.99;
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    const amount = Math.round(total * 100); // cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "cad", // change if you use another currency
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: isValidEmail(shippingInfo?.email)
        ? shippingInfo?.email
        : undefined,
      metadata: {
        fullName: shippingInfo?.fullName ?? "",
        address: shippingInfo?.address ?? "",
        city: shippingInfo?.city ?? "",
        state: shippingInfo?.state ?? "",
        zipCode: shippingInfo?.zipCode ?? "",
        country: shippingInfo?.country ?? "",
        cartSummary: items
          .map((i) => `${i.title} x${i.quantity}`)
          .join(" | ")
          .slice(0, 500),
      },
    });

    if (!paymentIntent.client_secret) {
      return NextResponse.json(
        {
          ok: false,
          message: "Failed to create payment intent",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        clientSecret: paymentIntent.client_secret,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating PaymentIntent:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to create PaymentIntent",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
