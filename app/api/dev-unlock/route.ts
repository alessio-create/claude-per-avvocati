import { NextRequest, NextResponse } from 'next/server';
import { signSession, type Tier } from '../../../lib/token';

/**
  * Development-only shortcut: bypasses Gumroad + Resend + KV and just sets a valid
  * session cookie so you can demo the post-purchase flow without external accounts.
  *
  * Disabled in production.
  */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'disabled in production' }, { status: 404 });
  }

  const tier = (req.nextUrl.searchParams.get('tier') ?? 'studio') as Tier;
  const bump = req.nextUrl.searchParams.get('bump') === '1';
  const token = await signSession({
    sub: 'demo@claudeperavvocati.it',
    sale: `demo-sale-${Date.now()}`,
    tier,
    bump,
  });

  const res = NextResponse.redirect(new URL('/corso', req.url));
  res.cookies.set('cpa_session', token, {
    httpOnly: true,
    secure: false, // dev only localhost is http
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 730,
  });
  return res;
}
