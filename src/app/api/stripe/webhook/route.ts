// src/app/api/stripe/webhook/route.ts
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// You must set this in your .env file
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  console.warn(
    "⚠ STRIPE_WEBHOOK_SECRET is not set. Stripe webhooks will fail verification."
  );
}

// Stripe sends POST requests with a raw body and a signature header.
// We must read the raw text body and verify the signature.
export async function POST(request: Request): Promise<Response> {
  const body = await request.text();
  const sig = headers().get("stripe-signature");

  if (!sig || !webhookSecret) {
    console.error("Missing stripe-signature header or webhook secret env");
    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("❌ Error verifying Stripe webhook signature:", err.message);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  // ✅ At this point the event is verified and safe to trust
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // TODO: implement your business logic here:
        // - Look up the user by session.client_reference_id or session.metadata.userId
        // - Mark their order/subscription as paid in your DB
        // - Send emails, etc.
        console.log("✅ checkout.session.completed:", {
          id: session.id,
          customer: session.customer,
          mode: session.mode,
          amount_total: session.amount_total,
          currency: session.currency,
        });
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`🔁 Subscription event: ${event.type}`, {
          id: subscription.id,
          status: subscription.status,
          customer: subscription.customer,
        });

        // TODO: update subscription status in your DB
        break;
      }

      default: {
        // It's good practice to log unhandled event types while developing
        console.log(`ℹ️ Unhandled Stripe event type: ${event.type}`);
      }
    }

    // Stripe requires a 2xx response to acknowledge receipt
    return new Response("OK", { status: 200 });
  } catch (err: any) {
    console.error("❌ Error handling Stripe webhook event:", err);
    // Still return 200 or 500 depending on how strict you want to be.
    // 500 tells Stripe to retry later.
    return new Response("Webhook handler failed", { status: 500 });
  }
}
