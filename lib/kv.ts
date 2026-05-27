import { Redis } from '@upstash/redis';
import type { Tier } from './token';

export interface Buyer { email: string; saleId: string; tier: Tier; purchasedAt: string }

let _client: Redis | null = null;
function client(): Redis {
  if (_client) return _client;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('KV_REST_API_URL / KV_REST_API_TOKEN not set');
  _client = new Redis({ url, token });
  return _client;
}

const buyerKey = (email: string) => `buyers:${email.toLowerCase()}`;
const rateKey = (email: string) => `rl:resend:${email.toLowerCase()}`;

export async function getBuyer(email: string): Promise<Buyer | null> {
  return (await client().get<Buyer>(buyerKey(email))) ?? null;
}

export async function setBuyer(b: Buyer): Promise<void> {
  await client().set(buyerKey(b.email), b);
}

export async function deleteBuyer(email: string): Promise<void> {
  await client().del(buyerKey(email));
}

/** Returns true if request is within limit (caller may proceed). */
export async function checkAndIncrementRateLimit(email: string, max = 3, ttlSec = 3600): Promise<boolean> {
  const k = rateKey(email);
  const n = await client().incr(k);
  if (n === 1) await client().expire(k, ttlSec);
  return n <= max;
}
