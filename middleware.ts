import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from './lib/token';

export const config = { matcher: ['/corso/:path*'] };

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get('cpa_session');
  const path = req.nextUrl.pathname + req.nextUrl.search;

  if (!cookie) {
    return NextResponse.redirect(new URL(`/sblocca?next=${encodeURIComponent(path)}`, req.url));
  }
  try {
    await verifySession(cookie.value);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(`/sblocca?next=${encodeURIComponent(path)}&reason=expired`, req.url));
  }
}
