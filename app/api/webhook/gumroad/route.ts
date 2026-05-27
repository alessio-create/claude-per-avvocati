import { NextRequest } from 'next/server';
import { verifyGumroadSignature, tierForPermalink } from '../../../../lib/gumroad';
import { getBuyer, setBuyer, deleteBuyer } from '../../../../lib/kv';
import { signSession } from '../../../../lib/token';
import { sendMagicLink } from '../../../../lib/email';
import { buildMagicLink } from '../../../../lib/magic-link';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get('x-gumroad-signature') ?? '';
  if (!verifyGumroadSignature(raw, sig)) return new Response('bad sig', { status: 401 });

  const params = new URLSearchParams(raw);
  const test = params.get('test') === 'true';
  if (test) return new Response('test ok', { status: 200 });

  const refunded = params.get('refunded') === 'true';
  const email = params.get('email')?.toLowerCase();
  const saleId = params.get('sale_id');
  const productPermalink = params.get('product_permalink');
  if (!email || !saleId || !productPermalink) return new Response('missing fields', { status: 400 });

  if (refunded) {
    const buyer = await getBuyer(email);
    if (buyer && buyer.saleId === saleId) {
      await deleteBuyer(email);
      return new Response('refunded', { status: 200 });
    }
    return new Response('refunded sale not matched', { status: 200 });
  }

  const tier = tierForPermalink(productPermalink);
  if (!tier) return new Response('unknown product', { status: 200 });

  const existing = await getBuyer(email);
  if (existing && existing.saleId === saleId) return new Response('already processed', { status: 200 });

  await setBuyer({ email, saleId, tier, purchasedAt: new Date().toISOString() });

  const token = await signSession({ sub: email, sale: saleId, tier });
  const magicLink = buildMagicLink(token);
  await sendMagicLink({ to: email, magicLink, tier });

  return new Response('ok', { status: 200 });
}
