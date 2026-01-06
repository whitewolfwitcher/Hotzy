import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { sendOrderReadyEmail } from '@/lib/email/resendClient';

export const runtime = 'nodejs';

const DEFAULT_SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7;

const getSignedUrlTtlSeconds = () => {
  const raw = process.env.SIGNED_URL_TTL_SECONDS;
  if (!raw) return DEFAULT_SIGNED_URL_TTL_SECONDS;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_SIGNED_URL_TTL_SECONDS;
  }
  return parsed;
};

const getAdminToken = (req: Request) =>
  req.headers.get('x-hotzy-admin-token');

// Admin-only retry endpoint for resending the signed PDF email.
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;
  if (!orderId) {
    return NextResponse.json({ ok: false, error: 'Missing order id' }, { status: 400 });
  }

  const expectedToken = process.env.HOTZY_ADMIN_TOKEN;
  if (!expectedToken) {
    return NextResponse.json(
      { ok: false, error: 'Admin token not configured' },
      { status: 500 }
    );
  }

  const providedToken = getAdminToken(req);
  if (!providedToken || providedToken !== expectedToken) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = supabaseServer();
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('pdf_path, cup_type, currency, amount_cad, amount_usd')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });
  }

  if (!order.pdf_path) {
    return NextResponse.json(
      { ok: false, error: 'Order PDF missing' },
      { status: 400 }
    );
  }

  const pdfKey = order.pdf_path.replace(/^pdfs\//, '');
  const ttlSeconds = getSignedUrlTtlSeconds();
  const { data: signedData, error: signedError } = await supabase.storage
    .from('pdfs')
    .createSignedUrl(pdfKey, ttlSeconds);

  if (signedError || !signedData?.signedUrl) {
    console.error('Failed to sign order PDF url', { orderId });
    return NextResponse.json(
      { ok: false, error: 'Failed to sign PDF url' },
      { status: 500 }
    );
  }

  const currency = (order.currency || 'CAD').toUpperCase();
  const amount =
    currency === 'USD' ? order.amount_usd ?? null : order.amount_cad ?? null;

  const emailResult = await sendOrderReadyEmail({
    orderId,
    cupType: order.cup_type ?? 'hotzy',
    currency,
    amount,
    pdfUrl: signedData.signedUrl,
  });

  if (!emailResult.ok) {
    return NextResponse.json(
      { ok: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({
      email_sent: true,
      email_sent_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (updateError) {
    return NextResponse.json(
      { ok: false, error: 'Failed to update email status' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
