import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { supabaseServer } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const getToken = (req: Request) => req.headers.get('x-hotzy-token');

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;
  if (!orderId) {
    return NextResponse.json({ ok: false, error: 'Missing order id' }, { status: 400 });
  }

  const internalToken = process.env.HOTZY_INTERNAL_TOKEN;
  if (!internalToken || getToken(req) !== internalToken) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = supabaseServer();
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('wrap_path')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });
  }

  if (!order.wrap_path) {
    return NextResponse.json({ ok: false, error: 'Missing wrap_path' }, { status: 400 });
  }

  const wrapKey = order.wrap_path.replace(/^wraps\//, '');
  const { data: wrapBlob, error: downloadError } = await supabase.storage
    .from('wraps')
    .download(wrapKey);

  if (downloadError || !wrapBlob) {
    return NextResponse.json({ ok: false, error: 'Failed to download wrap' }, { status: 500 });
  }

  const wrapBytes = new Uint8Array(await wrapBlob.arrayBuffer());
  const pdfDoc = await PDFDocument.create();

  let image;
  try {
    image = await pdfDoc.embedPng(wrapBytes);
  } catch {
    image = await pdfDoc.embedJpg(wrapBytes);
  }

  const { width, height } = image.scale(1);
  const page = pdfDoc.addPage([width, height]);
  page.drawImage(image, { x: 0, y: 0, width, height });

  const pdfBytes = await pdfDoc.save();
  const pdfKey = `${orderId}/print.pdf`;

  const { error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload(pdfKey, pdfBytes, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ ok: false, error: 'Failed to upload PDF' }, { status: 500 });
  }

  const pdfPath = `pdfs/${pdfKey}`;
  const { error: updateError } = await supabase
    .from('orders')
    .update({ pdf_path: pdfPath })
    .eq('id', orderId);

  if (updateError) {
    return NextResponse.json({ ok: false, error: 'Failed to update order' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, pdf_path: pdfPath }, { status: 200 });
}
