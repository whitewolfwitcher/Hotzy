import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: 'Missing session_id' },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json(
      {
        ok: true,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to retrieve Stripe session', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to retrieve Stripe session' },
      { status: 500 }
    );
  }
}
