import { stripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase/server';
import { getSiteUrl } from '@/lib/env';
import { getUnitAmount } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

function buildSafeErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const parts = [error.message || 'Unknown error'];
    const stripeError = error as {
      type?: string;
      code?: string;
      raw?: { message?: string };
    };

    if (stripeError.type) {
      parts.push(`type=${stripeError.type}`);
    }
    if (stripeError.code) {
      parts.push(`code=${stripeError.code}`);
    }
    if (stripeError.raw?.message) {
      parts.push(`raw=${stripeError.raw.message}`);
    }

    return parts.join(' | ');
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  return 'Unknown error';
}

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { ok: false, error: 'Missing STRIPE_SECRET_KEY' },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      return Response.json(
        { ok: false, error: 'Missing NEXT_PUBLIC_SITE_URL' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return Response.json(
        { ok: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { orderId } = body as { orderId?: string };
    if (!orderId) {
      return Response.json(
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
      return Response.json(
        { ok: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const cupType = order.cup_type as 'hotzy' | 'standard';
    const pricingCurrency = (order.currency || 'CAD').toUpperCase() as
      | 'CAD'
      | 'USD';
    const unitAmount = getUnitAmount(cupType, pricingCurrency);
    const stripeCurrency = pricingCurrency.toLowerCase();
    const unitAmountCents = Math.round(unitAmount * 100);

    const siteUrl = getSiteUrl();
    if (process.env.NODE_ENV !== 'production') {
      console.log('Stripe checkout siteUrl', siteUrl);
    }
    const successUrl = new URL('/checkout/success', siteUrl);
    successUrl.searchParams.set('orderId', orderId);

    const cancelUrl = new URL('/checkout/cancel', siteUrl);
    cancelUrl.searchParams.set('orderId', orderId);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: stripeCurrency,
            product_data: {
              name: 'Custom Mug',
            },
            unit_amount: unitAmountCents,
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
      return Response.json(
        { ok: false, error: 'Stripe session missing URL' },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', orderId);

    if (updateError) {
      return Response.json(
        { ok: false, error: 'Failed to update order' },
        { status: 500 }
      );
    }

    return Response.json({ ok: true, url: session.url });
  } catch (error) {
    const safeErrorMessage = buildSafeErrorMessage(error);
    console.error('create-checkout-session error', safeErrorMessage);
    return Response.json(
      { ok: false, error: safeErrorMessage },
      { status: 500 }
    );
  }
}
