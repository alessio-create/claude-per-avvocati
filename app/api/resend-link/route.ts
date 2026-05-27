import { NextRequest, NextResponse } from 'next/server';
import { getBuyer, checkAndIncrementRateLimit } from '../../../lib/kv';
import { signSession } from '../../../lib/token';
import { sendMagicLink } from '../../../lib/email';
import { buildMagicLink } from '../../../lib/magic-link';

const GENERIC = { ok: true, message: "Se l'email è registrata, riceverai il link." };

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? '').trim().toLowerCase();
  if (!email) return NextResponse.json(GENERIC, { status: 200 });

  const allowed = await checkAndIncrementRateLimit(email);
  if (!allowed) return NextResponse.json({ ok: false, message: 'Riprova più tardi.' }, { status: 429 });

  const buyer = await getBuyer(email);
  if (!buyer) return NextResponse.json(GENERIC, { status: 200 });

  const token = await signSession({ sub: email, sale: buyer.saleId, tier: buyer.tier });
  const magicLink = buildMagicLink(token);
  await sendMagicLink({ to: email, magicLink, tier: buyer.tier });
  return NextResponse.json(GENERIC, { status: 200 });
}
