import { describe, it, expect, beforeAll } from 'vitest';
import { createHmac } from 'node:crypto';
import { verifyGumroadSignature } from '../../lib/gumroad';

beforeAll(() => {
 process.env.GUMROAD_WEBHOOK_SECRET = 'test-secret';
});

function sign(body: string) {
 return createHmac('sha256', 'test-secret').update(body).digest('hex');
}

describe('verifyGumroadSignature', () => {
 it('accepts valid signature', () => {
  const body = '{"sale_id":"abc"}';
  expect(verifyGumroadSignature(body, sign(body))).toBe(true);
 });
 it('rejects bad signature', () => {
  expect(verifyGumroadSignature('{"sale_id":"abc"}', 'deadbeef')).toBe(false);
 });
 it('rejects missing secret', () => {
  delete process.env.GUMROAD_WEBHOOK_SECRET;
  expect(() => verifyGumroadSignature('{}', 'x')).toThrow();
  process.env.GUMROAD_WEBHOOK_SECRET = 'test-secret';
 });
});
