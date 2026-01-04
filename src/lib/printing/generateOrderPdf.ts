import { PDFDocument } from 'pdf-lib';
import { supabaseServer } from '@/lib/supabase/server';

export type GenerateOrderPdfResult =
  | { ok: true; pdf_path: string; skipped: boolean }
  | { ok: false; error: string; status: number };

export const generateOrderPdf = async (
  orderId: string
): Promise<GenerateOrderPdfResult> => {
  const supabase = supabaseServer();
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('wrap_path, pdf_path')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    return { ok: false, error: 'Order not found', status: 404 };
  }

  if (order.pdf_path) {
    return { ok: true, pdf_path: order.pdf_path, skipped: true };
  }

  if (!order.wrap_path) {
    return { ok: false, error: 'Missing wrap_path', status: 400 };
  }

  const wrapKey = order.wrap_path.replace(/^wraps\//, '');
  const { data: wrapBlob, error: downloadError } = await supabase.storage
    .from('wraps')
    .download(wrapKey);

  if (downloadError || !wrapBlob) {
    return { ok: false, error: 'Failed to download wrap', status: 500 };
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
    return { ok: false, error: 'Failed to upload PDF', status: 500 };
  }

  const pdfPath = `pdfs/${pdfKey}`;
  const { error: updateError } = await supabase
    .from('orders')
    .update({ pdf_path: pdfPath })
    .eq('id', orderId);

  if (updateError) {
    return { ok: false, error: 'Failed to update order', status: 500 };
  }

  return { ok: true, pdf_path: pdfPath, skipped: false };
};
