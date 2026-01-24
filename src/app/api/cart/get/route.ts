import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabase/server';

const COOKIE_NAME = 'hotzy_order_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function GET() {
  const cookieStore = cookies();
  const orderId = cookieStore.get(COOKIE_NAME)?.value || null;

  if (!orderId) {
    return NextResponse.json({ ok: true, orderId: null, itemCount: 0 });
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('orders')
    .select('id')
    .eq('id', orderId)
    .single();

  if (error || !data?.id) {
    const response = NextResponse.json({ ok: true, orderId: null, itemCount: 0 });
    response.cookies.set({
      name: COOKIE_NAME,
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  }

  const response = NextResponse.json(
    { ok: true, orderId: data.id, itemCount: 1 },
    { status: 200 }
  );

  response.cookies.set({
    name: COOKIE_NAME,
    value: data.id,
    httpOnly: true,
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
