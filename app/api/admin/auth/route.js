import { NextResponse } from 'next/server';

export async function POST(request) {
  const secret = process.env.NEXLIVE_ADMIN_SECRET;
  if (!secret) return NextResponse.json({ error: 'NEXLIVE_ADMIN_SECRET is not configured.' }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  if (!body.secret || body.secret !== secret) return NextResponse.json({ error: 'Invalid admin secret.' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('nexlive_admin', secret, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 60 * 60 * 12 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('nexlive_admin', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
  return res;
}
