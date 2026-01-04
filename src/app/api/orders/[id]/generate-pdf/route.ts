import { NextResponse } from 'next/server';
import { generateOrderPdf } from '@/lib/printing/generateOrderPdf';

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

  const result = await generateOrderPdf(orderId);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json(
    { ok: true, pdf_path: result.pdf_path },
    { status: 200 }
  );
}
