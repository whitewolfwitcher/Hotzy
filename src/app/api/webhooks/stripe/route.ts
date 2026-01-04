import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await req.text();
  console.log('Stripe webhook received');
  return NextResponse.json({ received: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405 }
  );
}
