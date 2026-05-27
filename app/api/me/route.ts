import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '../../../lib/token';

export const runtime = 'nodejs';

/**
 * GET /api/me
 * Returns the current tier (free | avvocato | studio | studio_plus) by
 * verifying the cpa_session cookie. Used by useTier() on the client to
 * decide what to show/lock in the course UI.
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get('cpa_session')?.value;
  if (!token) {
    return NextResponse.json({ tier: 'free', bump: false }, { headers: noCache() });
  }
  try {
    const claims = await verifySession(token);
    return NextResponse.json(
      { tier: claims.tier, bump: claims.bump ?? false, sub: claims.sub },
      { headers: noCache() },
    );
  } catch {
    return NextResponse.json({ tier: 'free', bump: false }, { headers: noCache() });
  }
}

function noCache() {
  return { 'Cache-Control': 'no-store, no-transform' };
}
