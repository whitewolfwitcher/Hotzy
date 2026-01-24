import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  qty: number;
  meta?: Record<string, unknown>;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { items?: CartItem[] }
    | null;

  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'Cart is empty' },
      { status: 400 }
    );
  }

  const items = body.items
    .filter((item) =>
      item &&
      typeof item.name === 'string' &&
      typeof item.priceCents === 'number' &&
      typeof item.currency === 'string' &&
      typeof item.qty === 'number'
    )
    .map((item) => ({
      name: item.name,
      priceCents: Math.max(0, Math.round(item.priceCents)),
      currency: item.currency.toLowerCase(),
      qty: Math.max(1, Math.round(item.qty)),
    }));

  if (items.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'Cart is empty' },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: item.currency,
          product_data: {
            name: item.name,
          },
          unit_amount: item.priceCents,
        },
        quantity: item.qty,
      })),
      success_url:
        'https://www.hotzy.ca/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://www.hotzy.ca/checkout/cancel',
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, error: 'Stripe session missing URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, url: session.url }, { status: 200 });
  } catch (error) {
    console.error('Failed to create Stripe checkout session', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create Stripe checkout session' },
      { status: 500 }
    );
  }
}
