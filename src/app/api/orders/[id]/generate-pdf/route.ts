import { NextResponse } from 'next/server';
import { generateOrderPdf } from '@/lib/printing/generateOrderPdf';

export const runtime = 'nodejs';

const getAdminToken = (req: Request) =>
  req.headers.get('x-hotzy-admin-token');

// Admin-only endpoint to regenerate the order PDF with current print specs.
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

  const result = await generateOrderPdf(orderId, { forceRegenerate: true });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json({ ok: true, pdf_path: result.pdf_path }, { status: 200 });
}
