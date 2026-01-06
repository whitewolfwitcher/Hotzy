import { PDFDocument } from 'pdf-lib';
import { supabaseServer } from '@/lib/supabase/server';
import { sendOrderReadyEmail } from '@/lib/email/resendClient';
import { PRINT_SPECS, type CupType } from '@/lib/printing/printSpecs';

export type GenerateOrderPdfResult =
  | { ok: true; pdf_path: string; skipped: boolean }
  | { ok: false; error: string; status: number };

type GenerateOrderPdfOptions = {
  forceRegenerate?: boolean;
};

const DEFAULT_SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7;

const mmToPt = (mm: number) => (mm / 25.4) * 72;

const getSignedUrlTtlSeconds = () => {
  const raw = process.env.SIGNED_URL_TTL_SECONDS;
  if (!raw) return DEFAULT_SIGNED_URL_TTL_SECONDS;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_SIGNED_URL_TTL_SECONDS;
  }
  return parsed;
};

export const generateOrderPdf = async (
  orderId: string,
  options: GenerateOrderPdfOptions = {}
): Promise<GenerateOrderPdfResult> => {
  const supabase = supabaseServer();
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(
      'wrap_path, pdf_path, email_sent, cup_type, currency, amount_cad, amount_usd'
    )
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    return { ok: false, error: 'Order not found', status: 404 };
  }

  const hadExistingPdf = Boolean(order.pdf_path);

  if (!order.wrap_path && !order.pdf_path) {
    return { ok: false, error: 'Missing wrap_path', status: 400 };
  }

  let pdfPath = order.pdf_path;
  const pdfKey = `${orderId}/print.pdf`;

  if (!pdfPath || options.forceRegenerate) {
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

    const cupType: CupType =
      order.cup_type === 'standard' || order.cup_type === 'hotzy'
        ? order.cup_type
        : 'hotzy';
    const { widthMm, heightMm, bleedMm } = PRINT_SPECS[cupType];
    const widthPt = mmToPt(widthMm + bleedMm * 2);
    const heightPt = mmToPt(heightMm + bleedMm * 2);

    const page = pdfDoc.addPage([widthPt, heightPt]);
    page.drawImage(image, { x: 0, y: 0, width: widthPt, height: heightPt });

    const pdfBytes = await pdfDoc.save();

    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(pdfKey, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      return { ok: false, error: 'Failed to upload PDF', status: 500 };
    }

    pdfPath = `pdfs/${pdfKey}`;
    const { error: updateError } = await supabase
      .from('orders')
      .update({ pdf_path: pdfPath })
      .eq('id', orderId);

    if (updateError) {
      return { ok: false, error: 'Failed to update order', status: 500 };
    }
  }

  const ttlSeconds = getSignedUrlTtlSeconds();
  const { data: signedData, error: signedError } = await supabase.storage
    .from('pdfs')
    .createSignedUrl(pdfKey, ttlSeconds);

  if (signedError || !signedData?.signedUrl) {
    console.error('Failed to sign order PDF url', { orderId });
    return { ok: true, pdf_path: pdfPath, skipped: hadExistingPdf };
  }

  if (!order.email_sent) {
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

    if (emailResult.ok) {
      const { error: emailUpdateError } = await supabase
        .from('orders')
        .update({
          email_sent: true,
          email_sent_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (emailUpdateError) {
        return { ok: false, error: 'Failed to update email status', status: 500 };
      }
    } else {
      console.error('Failed to send order PDF email', { orderId });
    }
  }

  return { ok: true, pdf_path: pdfPath, skipped: hadExistingPdf };
};
