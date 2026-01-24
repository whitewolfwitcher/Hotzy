import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabase/server';

const COOKIE_NAME = 'hotzy_order_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

type Currency = 'CAD' | 'USD';
type CupType = 'hotzy' | 'standard';

type AddCartBody = {
  cupType?: CupType;
  templateId?: string;
  sectionsFilledCount?: number;
  priceCents?: number;
  currency?: Currency;
  designMeta?: Record<string, unknown>;
  orderId?: string;
};

const toCurrency = (value: unknown): Currency =>
  value === 'USD' ? 'USD' : 'CAD';

const toCupType = (value: unknown): CupType =>
  value === 'standard' ? 'standard' : 'hotzy';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as AddCartBody | null;
  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const cookieStore = cookies();
  const existingId =
    (typeof body.orderId === 'string' && body.orderId.trim()) ||
    cookieStore.get(COOKIE_NAME)?.value ||
    '';

  const cupType = toCupType(body.cupType);
  const currency = toCurrency(body.currency);
  const priceCents =
    typeof body.priceCents === 'number' && Number.isFinite(body.priceCents)
      ? Math.max(0, Math.round(body.priceCents))
      : null;

  const sectionsFilledCount =
    typeof body.sectionsFilledCount === 'number' &&
    Number.isFinite(body.sectionsFilledCount)
      ? Math.max(0, Math.round(body.sectionsFilledCount))
      : 0;

  const itemCount = sectionsFilledCount > 0 ? sectionsFilledCount : 1;

  const payload: {
    status: 'draft';
    cup_type: CupType;
    currency: Currency;
    amount_cad?: number | null;
    amount_usd?: number | null;
  } = {
    status: 'draft',
    cup_type: cupType,
    currency,
  };

  if (priceCents !== null) {
    const price = priceCents / 100;
    if (currency === 'CAD') payload.amount_cad = price;
    if (currency === 'USD') payload.amount_usd = price;
  }

  const supabase = supabaseServer();
  let orderId = existingId;

  if (orderId) {
    const { data, error } = await supabase
      .from('orders')
      .update(payload)
      .eq('id', orderId)
      .select('id')
      .single();

    if (error || !data?.id) {
      orderId = '';
    }
  }

  if (!orderId) {
    const { data, error } = await supabase
      .from('orders')
      .insert(payload)
      .select('id')
      .single();

    if (error || !data?.id) {
      console.error('Failed to create draft order', error);
      return NextResponse.json(
        { ok: false, error: 'Failed to create draft order' },
        { status: 500 }
      );
    }

    orderId = data.id;
  }

  const response = NextResponse.json(
    { ok: true, orderId, itemCount },
    { status: 200 }
  );

  response.cookies.set({
    name: COOKIE_NAME,
    value: orderId,
    httpOnly: true,
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
