import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseServer } from '@/lib/supabase/server';
import { getStripeSecretKey, getStripeWebhookSecret } from '@/lib/env';

type OrderPayload = {
  status: 'paid';
  currency: string;
  amount_cad: number | null;
  amount_usd: number | null;
  stripe_payment_intent_id?: string | null;
  stripe_checkout_session_id?: string | null;
};

type InsertPayload = OrderPayload & {
  cup_type: 'hotzy';
};

const toMoney = (amountInCents: number | null | undefined) => {
  if (amountInCents == null) return null;
  return Number((amountInCents / 100).toFixed(2));
};

const buildAmountFields = (currency: string, amountInCents: number) => {
  const amount = toMoney(amountInCents);
  return {
    amount_cad: currency === 'CAD' ? amount : null,
    amount_usd: currency === 'USD' ? amount : null,
  };
};

const upsertOrder = async (
  payload: OrderPayload,
  orderId?: string | null
) => {
  const supabase = supabaseServer();

  if (orderId) {
    const { error } = await supabase
      .from('orders')
      .update(payload)
      .eq('id', orderId)
      .select('id');
    return { error };
  }

  if (payload.stripe_payment_intent_id) {
    const { data, error } = await supabase
      .from('orders')
      .update(payload)
      .eq('stripe_payment_intent_id', payload.stripe_payment_intent_id)
      .select('id');
    if (error) return { error };
    if (data && data.length > 0) return { error: null };
  }

  if (payload.stripe_checkout_session_id) {
    const { data, error } = await supabase
      .from('orders')
      .update(payload)
      .eq('stripe_checkout_session_id', payload.stripe_checkout_session_id)
      .select('id');
    if (error) return { error };
    if (data && data.length > 0) return { error: null };
  }

  const insertPayload: InsertPayload = {
    ...payload,
    cup_type: 'hotzy',
  };

  const { error } = await supabase
    .from('orders')
    .insert(insertPayload)
    .select('id');
  return { error };
};

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

  // Use Stripe dashboard "Send test events" for payment_intent.succeeded
  // and checkout.session.completed to validate this endpoint.

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const currency = paymentIntent.currency.toUpperCase();
      const amountInCents =
        paymentIntent.amount_received ?? paymentIntent.amount ?? 0;

      const payload: OrderPayload = {
        status: 'paid',
        currency,
        ...buildAmountFields(currency, amountInCents),
        stripe_payment_intent_id: paymentIntent.id,
      };

      const orderId = paymentIntent.metadata?.order_id || null;
      const { error } = await upsertOrder(payload, orderId);
      if (error) {
        console.error('Stripe webhook upsert failed', {
          type: event.type,
          id: event.id,
        });
        return NextResponse.json(
          { error: 'Failed to write order' },
          { status: 500 }
        );
      }

      console.info('Stripe webhook processed', {
        type: event.type,
        id: event.id,
      });
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const currency = session.currency?.toUpperCase() ?? 'USD';
      const amountInCents = session.amount_total ?? 0;

      const payload: OrderPayload = {
        status: 'paid',
        currency,
        ...buildAmountFields(currency, amountInCents),
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id ?? null,
      };

      const orderId = session.metadata?.order_id || null;
      const { error } = await upsertOrder(payload, orderId);
      if (error) {
        console.error('Stripe webhook upsert failed', {
          type: event.type,
          id: event.id,
        });
        return NextResponse.json(
          { error: 'Failed to write order' },
          { status: 500 }
        );
      }

      console.info('Stripe webhook processed', {
        type: event.type,
        id: event.id,
      });
      return NextResponse.json({ received: true }, { status: 200 });
    }
  } catch (err) {
    console.error('Stripe webhook handler error', {
      type: event.type,
      id: event.id,
    });
    return NextResponse.json(
      { error: 'Webhook handler error' },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405 }
  );
}
