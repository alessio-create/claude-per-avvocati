import Stripe from 'stripe';
import type { Tier } from './token';

/**
 * Single Stripe client instance. We construct it lazily so build-time
 * environments without STRIPE_SECRET_KEY (preview builds, tests) don't
 * crash on import. Use `getStripe()` at request time.
 */
let _client: Stripe | null = null;
export function getStripe(): Stripe {
  if (_client) return _client;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error('STRIPE_SECRET_KEY not set');
  _client = new Stripe(secret);
  return _client;
}

/**
 * Maps the Stripe Price ID (from the checkout line items) back to our
 * internal tier. Bump line items return null, callers should handle them
 * separately if they extend access.
 */
export function tierForPriceId(priceId: string): Tier | null {
  if (priceId === process.env.STRIPE_PRICE_AVVOCATO) return 'avvocato';
  if (priceId === process.env.STRIPE_PRICE_STUDIO) return 'studio';
  if (priceId === process.env.STRIPE_PRICE_STUDIO_PLUS) return 'studio_plus';
  return null;
}

/**
 * Maps an internal tier (used in the marketing URL `?tier=avvocato`) back
 * to the Stripe Price ID. Used when building a Checkout Session from the
 * checkout page.
 */
export function priceIdForTier(tier: Tier): string | null {
  switch (tier) {
    case 'avvocato': return process.env.STRIPE_PRICE_AVVOCATO ?? null;
    case 'studio': return process.env.STRIPE_PRICE_STUDIO ?? null;
    case 'studio_plus': return process.env.STRIPE_PRICE_STUDIO_PLUS ?? null;
    default: return null;
  }
}

/**
 * Stripe webhook signature verification. Returns the parsed event on
 * success, throws on bad signature. Stripe requires the raw request body
 * (no JSON parse) for the HMAC to match.
 */
export function verifyStripeEvent(rawBody: string, signature: string): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET not set');
  return getStripe().webhooks.constructEvent(rawBody, signature, secret);
}
