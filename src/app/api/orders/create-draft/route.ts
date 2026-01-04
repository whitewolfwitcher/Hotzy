import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { createOrderUploadToken } from '@/lib/orders/orderUploadToken';

export const runtime = 'nodejs';

type CupType = 'hotzy' | 'standard';
type Currency = 'CAD' | 'USD';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { cupType, currency, amount_cad, amount_usd } = body as {
    cupType?: CupType;
    currency?: Currency;
    amount_cad?: number;
    amount_usd?: number;
  };

  if (cupType !== 'hotzy' && cupType !== 'standard') {
    return NextResponse.json(
      { ok: false, error: 'Invalid cup type' },
      { status: 400 }
    );
  }

  if (currency !== 'CAD' && currency !== 'USD') {
    return NextResponse.json(
      { ok: false, error: 'Invalid currency' },
      { status: 400 }
    );
  }

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

  if (currency === 'CAD' && typeof amount_cad === 'number') {
    payload.amount_cad = amount_cad;
  }

  if (currency === 'USD' && typeof amount_usd === 'number') {
    payload.amount_usd = amount_usd;
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('orders')
    .insert(payload)
    .select('id')
    .single();

  if (error || !data?.id) {
    return NextResponse.json(
      { ok: false, error: 'Failed to create draft order' },
      { status: 500 }
    );
  }

  const orderUploadToken = createOrderUploadToken(data.id);
  return NextResponse.json(
    { ok: true, orderId: data.id, orderUploadToken },
    { status: 200 }
  );
}
