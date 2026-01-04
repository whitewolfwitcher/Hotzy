import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase/server';
import { getUnitAmount } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { orderId } = body as { orderId?: string };
  if (!orderId) {
    return NextResponse.json(
      { ok: false, error: 'Missing orderId' },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();
  const { data: order, error } = await supabase
    .from('orders')
    .select('status, cup_type, currency, wrap_path')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    return NextResponse.json(
      { ok: false, error: 'Order not found' },
      { status: 404 }
    );
  }

  if (order.status === 'paid') {
    return NextResponse.json(
      { ok: false, error: 'Order already paid' },
      { status: 409 }
    );
  }

  if (!order.wrap_path) {
    return NextResponse.json(
      { ok: false, error: 'Missing wrap' },
      { status: 400 }
    );
  }

  const cupType = order.cup_type as 'hotzy' | 'standard';
  const currency = (order.currency || 'CAD').toUpperCase() as 'CAD' | 'USD';
  const amount = getUnitAmount(cupType, currency);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
    metadata: { orderId },
  });

  const { error: updateError } = await supabase
    .from('orders')
    .update({ stripe_payment_intent_id: paymentIntent.id })
    .eq('id', orderId);

  if (updateError) {
    return NextResponse.json(
      { ok: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { ok: true, clientSecret: paymentIntent.client_secret },
    { status: 200 }
  );
}
