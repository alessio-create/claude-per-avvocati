import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Tier } from './token';

export function verifyGumroadSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.GUMROAD_WEBHOOK_SECRET;
  if (!secret) throw new Error('GUMROAD_WEBHOOK_SECRET not set');
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function tierForPermalink(permalink: string): Tier | null {
  if (permalink === process.env.GUMROAD_PRODUCT_AVVOCATO) return 'avvocato';
  if (permalink === process.env.GUMROAD_PRODUCT_STUDIO) return 'studio';
  if (permalink === process.env.GUMROAD_PRODUCT_STUDIO_PLUS) return 'studio_plus';
  return null;
}
