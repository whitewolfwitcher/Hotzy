import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { generateOrderPdf } from '@/lib/printing/generateOrderPdf';
import { verifyOrderUploadToken } from '@/lib/orders/orderUploadToken';

export const runtime = 'nodejs';

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg']);

const getOrderToken = (req: Request) =>
  req.headers.get('x-order-upload-token');

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;
  if (!orderId) {
    return NextResponse.json({ ok: false, error: 'Missing order id' }, { status: 400 });
  }

  const orderToken = getOrderToken(req);
  const isOrderTokenValid = orderToken
    ? verifyOrderUploadToken(orderToken, orderId)
    : false;

  if (!isOrderTokenValid) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'Missing file' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ ok: false, error: 'Invalid file type' }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ ok: false, error: 'File too large' }, { status: 400 });
  }

  const extension = file.type === 'image/jpeg' ? 'jpg' : 'png';
  const objectPath = `${orderId}/wrap.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = supabaseServer();
  const { error: uploadError } = await supabase.storage
    .from('wraps')
    .upload(objectPath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json(
      { ok: false, error: 'Upload failed' },
      { status: 500 }
    );
  }

  const wrapPath = `wraps/${objectPath}`;
  const { error: updateError } = await supabase
    .from('orders')
    .update({ wrap_path: wrapPath })
    .eq('id', orderId);

  if (updateError) {
    return NextResponse.json(
      { ok: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('status, pdf_path, email_sent')
    .eq('id', orderId)
    .single();

  const shouldFinalize =
    !orderError &&
    order?.status === 'paid' &&
    (!order.pdf_path || !order.email_sent);

  if (shouldFinalize) {
    const result = await generateOrderPdf(orderId);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: 'Failed to generate PDF' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true, wrap_path: wrapPath }, { status: 200 });
}
