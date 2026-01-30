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
      return new Response(JSON.stringify({ error: "Missing orderId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    const deployKey = process.env.CONVEX_DEPLOY_KEY;
    if (!convexUrl || !deployKey) {
      return new Response(JSON.stringify({ error: "Convex env vars missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const convex = new ConvexHttpClient(convexUrl);
    convex.setAdminAuth(deployKey);

    const order = await convex.query(api.orders.getForPayment, {
      orderId: orderId as any,
    });

    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!order.wrapFileId) {
      return new Response(JSON.stringify({ error: "Wrap file missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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
      return new Response(JSON.stringify({ error: "Missing client secret" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    await convex.mutation(api.orders.setPaymentIntent, {
      orderId: orderId as any,
      stripePaymentIntentId: intent.id,
    });

    return new Response(JSON.stringify({ clientSecret: intent.client_secret }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to create PaymentIntent", error);
    return new Response(
      JSON.stringify({ error: "Failed to create PaymentIntent" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
