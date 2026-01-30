import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
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

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    const deployKey = process.env.CONVEX_DEPLOY_KEY;
    const missing: string[] = [];
    if (!stripeSecretKey) missing.push("STRIPE_SECRET_KEY");
    if (!stripeWebhookSecret) missing.push("STRIPE_WEBHOOK_SECRET");
    if (!siteUrl) missing.push("NEXT_PUBLIC_SITE_URL");
    if (!convexUrl) missing.push("NEXT_PUBLIC_CONVEX_URL");
    if (!deployKey) missing.push("CONVEX_DEPLOY_KEY");

    if (missing.length > 0) {
      return Response.json(
        { ok: false, error: `Missing env vars: ${missing.join(", ")}` },
        { status: 500 }
      );
    }

    const convex = new ConvexHttpClient(convexUrl);
    convex.setAdminAuth(deployKey);

    const order = await convex.query(api.orders.getForPayment, {
      orderId: orderId as any,
    });

    if (!order) {
      return Response.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    if (!order.wrapFileId) {
      return Response.json(
        { ok: false, error: "Wrap file missing" },
        { status: 400 }
      );
    }

    const unitAmount = getUnitAmount(order.cupType, order.currency);
    const amountCents = Math.round(unitAmount * 100);

    const stripe = getStripe();
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
