import Stripe from 'stripe';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { getStripeSecretKey, getStripeWebhookSecret } from '@/lib/env';
import { getUnitAmount } from '@/lib/pricing';
import { sendOrderReadyEmail } from '@/lib/email/resendClient';

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

  if (event.type === 'payment_intent.succeeded') {
    try {
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

      const fulfillFromStripeFunction = 'api.fulfill.fulfillFromStripe';
      const fulfillment = await (async () => {
        try {
          return await convex.action(api.fulfill.fulfillFromStripe, {
            paymentIntentId,
            orderId: orderId ? (orderId as any) : undefined,
          });
        } catch (err) {
          logConvexCallError(fulfillFromStripeFunction, err);
          throw err;
        }
      })();

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
          const markEmailSentFunction = 'api.orders.markEmailSent';

          try {
            await convex.mutation(api.orders.markEmailSent, {
              orderId: fulfillment.orderId as any,
            });
          } catch (err) {
            logConvexCallError(markEmailSentFunction, err);
            throw err;
          }
        } else {
          console.error('Order email failed', emailResult.error);
        }
      }
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
