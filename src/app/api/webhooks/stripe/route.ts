import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { getStripeSecretKey, getStripeWebhookSecret } from '@/lib/env';
import { getUnitAmount } from '@/lib/pricing';
import { sendOrderReadyEmail } from '@/lib/email/resendClient';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }

  const stripe = new Stripe(getStripeSecretKey(), {
    apiVersion: '2023-10-16',
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      getStripeWebhookSecret()
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const paymentIntentId = intent.id;
      const orderId = intent.metadata?.orderId;

      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      const deployKey = process.env.CONVEX_DEPLOY_KEY;
      if (!convexUrl || !deployKey) {
        throw new Error('Missing Convex env vars');
      }

      const convex = new ConvexHttpClient(convexUrl);
      convex.setAdminAuth(deployKey);

      const fulfillment = await convex.action(api.fulfill.fulfillFromStripe, {
        paymentIntentId,
        orderId: orderId ? (orderId as any) : undefined,
      });

      if (fulfillment?.pdfFileId && !fulfillment?.emailSent) {
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.hotzy.ca';
        const pdfUrl = `${siteUrl}/api/convex-file?id=${encodeURIComponent(
          fulfillment.pdfFileId
        )}`;
        const amount = getUnitAmount(
          fulfillment.cupType,
          fulfillment.currency
        );

        const emailResult = await sendOrderReadyEmail({
          orderId: fulfillment.orderId,
          cupType: fulfillment.cupType,
          currency: fulfillment.currency,
          amount,
          pdfUrl,
        });

        if (emailResult.ok) {
          await convex.mutation(api.orders.markEmailSent, {
            orderId: fulfillment.orderId as any,
          });
        } else {
          console.error('Order email failed', emailResult.error);
        }
      }
    }
  } catch (err) {
    console.error('Stripe webhook handler error', err);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405 }
  );
}
