import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase/server';
import { getSiteUrl } from '@/lib/env';

export const dynamic = 'force-dynamic';

const PRICE_CAD = {
  hotzy: 20.45,
  standard: 15.99,
} as const;

const CAD_TO_USD = 0.74;

const roundAmount = (amount: number) =>
  Number(amount.toFixed(2));

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
    .select('cup_type, currency')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    return NextResponse.json(
      { ok: false, error: 'Order not found' },
      { status: 404 }
    );
  }

  const cupType = order.cup_type as 'hotzy' | 'standard';
  const currency = (order.currency || 'CAD').toUpperCase() as 'CAD' | 'USD';
  const baseCad = PRICE_CAD[cupType] ?? PRICE_CAD.hotzy;
  const unitAmount =
    currency === 'USD' ? roundAmount(baseCad * CAD_TO_USD) : baseCad;

  const siteUrl = getSiteUrl();
  const successUrl = new URL('/checkout/success', siteUrl);
  successUrl.searchParams.set('orderId', orderId);

  const cancelUrl = new URL('/customizer', siteUrl);
  cancelUrl.searchParams.set('canceled', '1');

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: 'Custom Mug',
          },
          unit_amount: Math.round(unitAmount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: successUrl.toString(),
    cancel_url: cancelUrl.toString(),
    metadata: {
      orderId,
    },
  });

  if (!session.url) {
    return NextResponse.json(
      { ok: false, error: 'Stripe session missing URL' },
      { status: 500 }
    );
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ stripe_checkout_session_id: session.id })
    .eq('id', orderId);

  if (updateError) {
    return NextResponse.json(
      { ok: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, url: session.url }, { status: 200 });
}
