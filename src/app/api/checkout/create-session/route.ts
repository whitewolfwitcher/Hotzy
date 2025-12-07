// src/app/api/checkout/create-session/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

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

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const {
      items,
      shippingInfo,
      successPath = "/checkout/success",
      cancelPath = "/checkout/cancel",
    } = body as {
      items?: CartItem[];
      shippingInfo?: ShippingInfo;
      successPath?: string;
      cancelPath?: string;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Basic validation for shipping info (same required fields as frontend)
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

    // Compute subtotal from items
    let subtotal = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const unitPrice = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      if (unitPrice <= 0 || qty <= 0) continue;

      subtotal += unitPrice * qty;

      lineItems.push({
        price_data: {
          currency: "cad", // adjust if you use a different currency
          product_data: {
            name: item.title,
          },
          unit_amount: Math.round(unitPrice * 100), // cents
        },
        quantity: qty,
      });
    }

    if (lineItems.length === 0) {
      return NextResponse.json(
        { ok: false, message: "No valid cart items" },
        { status: 400 }
      );
    }

    // Apply same shipping & tax rules as frontend
    const shipping = subtotal > 50 ? 0 : 5.99;
    const taxRate = 0.08;
    const tax = subtotal * taxRate;

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: "Tax",
          },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    const frontendUrl =
      process.env.FRONTEND_URL ?? "http://localhost:3000";

    const success_url = new URL(successPath, frontendUrl).toString();
    const cancel_url = new URL(cancelPath, frontendUrl).toString();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url,
      cancel_url,
      customer_email: shippingInfo?.email ?? undefined,
      metadata: {
        fullName: shippingInfo?.fullName ?? "",
        address: shippingInfo?.address ?? "",
        city: shippingInfo?.city ?? "",
        state: shippingInfo?.state ?? "",
        zipCode: shippingInfo?.zipCode ?? "",
        country: shippingInfo?.country ?? "",
        // You can store a compact cart summary if you want:
        cartSummary: items
          .map((i) => `${i.title} x${i.quantity}`)
          .join(" | ")
          .slice(0, 500),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        {
          ok: false,
          message: "Stripe did not return a session URL",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        url: session.url,
        sessionId: session.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating Stripe Checkout Session:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to create Stripe Checkout Session",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
