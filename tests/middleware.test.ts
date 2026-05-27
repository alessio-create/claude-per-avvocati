import { describe, it, expect, beforeAll } from 'vitest';
import { signSession } from '../lib/token';
import { middleware } from '../middleware';
import { NextRequest } from 'next/server';

beforeAll(() => { process.env.JWT_SECRET = 'test-secret-must-be-long-enough-for-hs256-32+chars'; });

function req(path: string, cookie?: string): NextRequest {
 const headers = new Headers();
 if (cookie) headers.set('cookie', `cpa_session=${cookie}`);
 return new NextRequest(new URL(`http://localhost${path}`), { headers });
}

describe('middleware', () => {
 it('redirects to /sblocca when no cookie', async () => {
  const res = await middleware(req('/corso/01/01'));
  expect(res.status).toBe(307);
  expect(res.headers.get('location')).toContain('/sblocca?next=%2Fcorso%2F01%2F01');
 });

 it('passes through when cookie is valid', async () => {
  const token = await signSession({ sub: 'a@b.it', sale: 's', tier: 'avvocato' });
  const res = await middleware(req('/corso/01/01', token));
  expect(res.status).toBe(200);
 });

 it('redirects with reason=expired when cookie is invalid', async () => {
  const res = await middleware(req('/corso/01/01', 'not-a-jwt'));
  expect(res.status).toBe(307);
  expect(res.headers.get('location')).toContain('reason=expired');
 });
});
