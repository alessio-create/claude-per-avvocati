import { describe, it, expect, beforeAll } from 'vitest';
import { signSession, verifySession } from '../../lib/token';

beforeAll(() => {
 process.env.JWT_SECRET = 'test-secret-must-be-long-enough-for-hs256-32+chars';
});

describe('token', () => {
 it('round-trips a session', async () => {
  const token = await signSession({ sub: 'a@b.it', sale: 'sale-123', tier: 'studio' });
  const claims = await verifySession(token);
  expect(claims.sub).toBe('a@b.it');
  expect(claims.sale).toBe('sale-123');
  expect(claims.tier).toBe('studio');
 });

 it('rejects tampered token', async () => {
  const token = await signSession({ sub: 'a@b.it', sale: 's', tier: 'avvocato' });
  const bad = token.slice(0, -2) + 'AA';
  await expect(verifySession(bad)).rejects.toThrow();
 });
});
