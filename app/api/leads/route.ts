import { NextRequest, NextResponse } from 'next/server';
import { getBuyer, setBuyer, checkAndIncrementRateLimit } from '../../../lib/kv';
import { signSession } from '../../../lib/token';
import { sendMagicLink } from '../../../lib/email';
import { buildMagicLink } from '../../../lib/magic-link';

export const runtime = 'nodejs';

interface LeadBody {
  name?: string;
  email?: string;
  studio?: string;
  source?: string;
}

const GENERIC = { ok: true, message: 'Iscrizione registrata. Controlla la posta per il link di accesso.' };

/**
 * POST /api/leads
 *
 * Free-tier signup endpoint. Creates a buyer record with `tier: "free"` in
 * KV (idempotent on email), mints a JWT, and emails a magic link via
 * Resend. Returning visitors entering the same email get a fresh magic
 * link without a duplicate KV entry.
 *
 * Always returns the same generic 200 message so a public form can't be
 * used to enumerate registered emails. Real failures are logged
 * server-side only.
 */
export async function POST(req: NextRequest) {
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false, message: 'JSON non valido.' }, { status: 400 });
  }

  const email = String(body.email ?? '').trim().toLowerCase();
  const name = String(body.name ?? '').trim();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ ok: false, message: 'Email mancante o non valida.' }, { status: 400 });
  }

  // Rate-limit per email so the form can't be used as a spam vector.
  const allowed = await checkAndIncrementRateLimit(email).catch(() => true);
  if (!allowed) {
    return NextResponse.json({ ok: false, message: 'Troppe richieste, riprova fra un minuto.' }, { status: 429 });
  }

  // Idempotent: reuse the existing buyer record (and its saleId) when the
  // email is already in KV, regardless of original tier. This means a paid
  // user who re-submits the free form just gets a fresh magic-link email
  // for their existing tier, not a downgrade.
  let buyer = await getBuyer(email).catch(() => null);
  if (!buyer) {
    buyer = {
      email,
      saleId: `free-${Date.now()}`,
      tier: 'free',
      purchasedAt: new Date().toISOString(),
    };
    await setBuyer(buyer);
  }

  try {
    const token = await signSession({ sub: email, sale: buyer.saleId, tier: buyer.tier });
    const magicLink = buildMagicLink(token);
    await sendMagicLink({ to: email, magicLink, tier: buyer.tier });
  } catch (err) {
    // Log server-side, return generic to caller so the form looks fine even
    // if Resend has a transient outage. The user can retry from /sblocca.
    console.error('[api/leads] email send failed:', err);
  }

  // Tag the source if provided, useful for analytics later.
  if (body.source) {
    console.log('[api/leads] new free signup, source=', body.source, 'email=', email);
  }

  return NextResponse.json(GENERIC, { status: 200 });
}
