import { SignJWT, jwtVerify } from 'jose';

export type Tier = 'free' | 'avvocato' | 'studio' | 'studio_plus';
export interface SessionClaims {
  sub: string;
  sale: string;
  tier: Tier;
  /** True when the order included the FutureLaw marketing-audit bump. */
  bump?: boolean;
}

function key(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET not set');
  return new TextEncoder().encode(s);
}

export async function signSession(claims: SessionClaims): Promise<string> {
  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('730d')
    .sign(key());
}

export async function verifySession(token: string): Promise<SessionClaims> {
  const { payload } = await jwtVerify(token, key());
  return payload as unknown as SessionClaims;
}
