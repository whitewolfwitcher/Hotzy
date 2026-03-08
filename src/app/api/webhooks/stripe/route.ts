import Stripe from 'stripe';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { getStripeSecretKey, getStripeWebhookSecret } from '@/lib/env';

export const runtime = 'nodejs';

function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : 'Unknown error';
}

function logConvexCallError(functionName: string, err: unknown) {
  console.error('webhook error: convex call failed', {
    functionName,
    message: getErrorMessage(err),
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    console.error('webhook error: missing stripe-signature header');
    return Response.json(
      { ok: false, error: 'Webhook signature verification failed' },
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
    console.error(
      'webhook error: signature verification failed',
      getErrorMessage(err)
    );
    return Response.json(
      { ok: false, error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  console.log('webhook event type', event.type);

  if (event.type === 'payment_intent.succeeded') {
    try {
      const intent = event.data.object as Stripe.PaymentIntent;
      const paymentIntentId = intent.id;
      console.log('webhook paymentIntent id', paymentIntentId);

      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      const deployKey = process.env.CONVEX_DEPLOY_KEY;
      if (!convexUrl || !deployKey) {
        throw new Error('Missing Convex env vars');
      }

      const convex = new ConvexHttpClient(convexUrl);
      convex.setAdminAuth(deployKey);

      const markPaidByPaymentIntentFunction =
        'api.orders.markPaidByPaymentIntent';
      const result = await (async () => {
        try {
          return await convex.mutation(api.orders.markPaidByPaymentIntent, {
            stripePaymentIntentId: paymentIntentId,
          });
        } catch (err) {
          logConvexCallError(markPaidByPaymentIntentFunction, err);
          throw err;
        }
      })();
      console.log('webhook order marked paid', result.orderId);
    } catch (err) {
      console.error(
        'webhook error: fulfillment failed',
        getErrorMessage(err)
      );
      return Response.json(
        { ok: false, error: 'Webhook fulfillment failed' },
        { status: 400 }
      );
    }
  }

  return Response.json({ ok: true }, { status: 200 });
}

export async function GET() {
  return Response.json(
    { error: 'Method Not Allowed' },
    { status: 405 }
  );
}
