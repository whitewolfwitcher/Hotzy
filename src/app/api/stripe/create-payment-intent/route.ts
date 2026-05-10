import { api } from "../../../../../convex/_generated/api";
import { getConvexHttpClient } from "@/lib/convex-server";
import { getStripe } from "@/lib/stripe";
import { getUnitAmount } from "@/lib/pricing";

export async function POST(request: Request) {
  try {
    const { orderId } = (await request.json().catch(() => ({}))) as {
      orderId?: string;
    };

    if (!orderId) {
      return Response.json(
        { ok: false, error: "Missing orderId" },
        { status: 400 }
      );
    }

    const missing: string[] = [];
    if (!process.env.STRIPE_SECRET_KEY) missing.push("STRIPE_SECRET_KEY");
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      missing.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
    }
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) missing.push("NEXT_PUBLIC_CONVEX_URL");

    if (missing.length > 0) {
      return Response.json(
        { ok: false, error: `Missing env vars: ${missing.join(", ")}` },
        { status: 500 }
      );
    }

    const convex = getConvexHttpClient();
    const order = await convex.query(api.orders.getForPayment, {
      orderId: orderId as any,
    });

    if (!order) {
      return Response.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    const unitAmount = order.amount ?? getUnitAmount(order.cupType, order.currency);
    const amountCents = Math.round(unitAmount * 100);

    const stripe = getStripe();
    if (order.stripePaymentIntentId) {
      const existingIntent = await stripe.paymentIntents.retrieve(
        order.stripePaymentIntentId
      );

      if (existingIntent.client_secret && existingIntent.status !== "canceled") {
        return Response.json({
          ok: true,
          clientSecret: existingIntent.client_secret,
        });
      }
    }

    const intent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: order.currency.toLowerCase(),
      metadata: { orderId },
      automatic_payment_methods: { enabled: true },
    });

    if (!intent.client_secret) {
      return Response.json(
        { ok: false, error: "Missing client secret" },
        { status: 500 }
      );
    }

    await convex.mutation(api.orders.setPaymentIntent, {
      orderId: orderId as any,
      stripePaymentIntentId: intent.id,
    });

    return Response.json({ ok: true, clientSecret: intent.client_secret });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("create-payment-intent error", message);
    return Response.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
