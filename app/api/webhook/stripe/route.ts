import { NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { getStripe, tierForPriceId, verifyStripeEvent } from '../../../../lib/stripe';
import { getBuyer, setBuyer, deleteBuyer } from '../../../../lib/kv';
import { signSession } from '../../../../lib/token';
import { sendMagicLink } from '../../../../lib/email';
import { buildMagicLink } from '../../../../lib/magic-link';
import type { Tier } from '../../../../lib/token';

export const runtime = 'nodejs';

/**
 * Stripe webhook receiver. Handles two events:
 *
 *   - `checkout.session.completed`: mint a JWT for the buyer's email,
 *     store the {email, tier, saleId} record in KV, and email a magic
 *     link. Idempotent on `session.id`.
 *
 *   - `charge.refunded`: if the matching buyer record exists, drop it,
 *     revoking course access.
 *
 * Other events are acknowledged with 200 so Stripe stops retrying.
 */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;
  try {
    event = verifyStripeEvent(raw, sig);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'invalid signature';
    return new Response(`bad sig: ${message}`, { status: 401 });
  }

  if (event.type === 'checkout.session.completed') {
    return handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
  }
  if (event.type === 'charge.refunded') {
    return handleChargeRefunded(event.data.object as Stripe.Charge);
  }

  // Acknowledge other events without action.
  return new Response('ignored', { status: 200 });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<Response> {
  // Email: prefer the customer_details captured by Stripe Checkout (always
  // present after a successful session), fall back to customer_email.
  const email = (session.customer_details?.email ?? session.customer_email ?? '').toLowerCase();
  if (!email) return new Response('no email', { status: 400 });

  // Resolve the tier from the line items. We retrieve fresh because the
  // event object's line_items is not expanded by default.
  let tier: Tier | null = null;
  try {
    const stripe = getStripe();
    const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
    for (const item of items.data) {
      const priceId = item.price?.id;
      if (!priceId) continue;
      const t = tierForPriceId(priceId);
      if (t) { tier = t; break; }
    }
  } catch {
    /* fall through to metadata fallback */
  }

  // Fallback: tier was stamped in session.metadata at creation time.
  if (!tier) {
    const metaTier = session.metadata?.tier;
    if (metaTier === 'avvocato' || metaTier === 'studio' || metaTier === 'studio_plus') {
      tier = metaTier;
    }
  }
  if (!tier) return new Response('unknown tier', { status: 200 });

  // Idempotency: Stripe can retry. The session.id is the natural dedupe key.
  const existing = await getBuyer(email);
  if (existing && existing.saleId === session.id) {
    return new Response('already processed', { status: 200 });
  }

  await setBuyer({
    email,
    saleId: session.id,
    tier,
    purchasedAt: new Date().toISOString(),
  });

  const token = await signSession({ sub: email, sale: session.id, tier });
  const magicLink = buildMagicLink(token);
  await sendMagicLink({ to: email, magicLink, tier });

  return new Response('ok', { status: 200 });
}

async function handleChargeRefunded(charge: Stripe.Charge): Promise<Response> {
  // The Checkout Session id is on the PaymentIntent's metadata only after
  // we've gone through Checkout. The simplest reliable lookup is by email
  // on the charge billing details.
  const email = charge.billing_details?.email?.toLowerCase();
  if (!email) return new Response('no email on charge', { status: 200 });

  const buyer = await getBuyer(email);
  if (!buyer) return new Response('no buyer record', { status: 200 });

  await deleteBuyer(email);
  return new Response('refunded', { status: 200 });
}
