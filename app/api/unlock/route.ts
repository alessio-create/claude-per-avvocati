import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '../../../lib/token';

function safeNext(raw: string | null): string {
  if (!raw) return '/corso';
  // Strip leading // (protocol-relative URL bypass)
  const cleaned = raw.replace(/^\/+/, '/');
  // Only allow paths that start with /corso or /sblocca
  if (/^\/corso(\/|$|\?)/.test(cleaned) || /^\/sblocca(\/|$|\?)/.test(cleaned)) {
    return cleaned;
  }
  return '/corso';
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const next = safeNext(req.nextUrl.searchParams.get('next'));
  if (!token) return NextResponse.json({ ok: false, reason: 'missing' }, { status: 400 });

  try {
    await verifySession(token);
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid' }, { status: 400 });
  }

  const res = NextResponse.redirect(new URL(next, req.url));
  res.cookies.set('cpa_session', token, {
    httpOnly: true, secure: true, sameSite: 'lax',
    path: '/', maxAge: 60 * 60 * 24 * 730,
  });
  return res;
}
