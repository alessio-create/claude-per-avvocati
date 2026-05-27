import { NextRequest, NextResponse } from 'next/server';
import { getStripe, priceIdForTier } from '../../../lib/stripe';
import type { Tier } from '../../../lib/token';

export const runtime = 'nodejs';

interface CheckoutBody {
  tier?: string;
  email?: string;
  bump?: boolean;
}

/**
 * Creates a Stripe Checkout Session for the requested tier and redirects
 * the buyer to the Stripe-hosted payment page. Optionally bundles a
 * one-time bump line item (FutureLaw audit) if `bump: true`.
 *
 * The buyer's email goes through `customer_email`, so Stripe pre-fills it.
 * The tier is also stamped in session.metadata so the webhook has a
 * fallback if the price lookup ever drifts.
 */
export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: 'JSON non valido.' }, { status: 400 });
  }

  const tier: Tier = body.tier === 'studio' ? 'studio' : body.tier === 'studio_plus' ? 'studio_plus' : 'avvocato';
  const priceId = priceIdForTier(tier);
  if (!priceId) {
    return NextResponse.json({ error: `Prezzo Stripe non configurato per il piano ${tier}.` }, { status: 500 });
  }

  const siteUrl = process.env.SITE_URL ?? new URL(req.url).origin;
  const stripe = getStripe();

  const lineItems: Array<{ price: string; quantity: number }> = [{ price: priceId, quantity: 1 }];
  if (body.bump && process.env.STRIPE_PRICE_BUMP) {
    lineItems.push({ price: process.env.STRIPE_PRICE_BUMP, quantity: 1 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: body.email?.toLowerCase().trim() || undefined,
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true }, // collect P.IVA for Italian businesses
      allow_promotion_codes: true,
      metadata: { tier, bump: body.bump ? '1' : '0' },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout?tier=${tier}&cancelled=1`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe non ha restituito un URL di checkout.' }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json({ error: `Stripe: ${message}` }, { status: 502 });
  }
}
