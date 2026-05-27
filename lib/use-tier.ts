'use client';
import { useEffect, useState } from 'react';
import type { Tier } from './token';

interface MeResponse {
  tier: Tier;
  bump: boolean;
  sub?: string;
}

/**
 * Client hook: fetches the current user's tier from /api/me. Returns null
 * while loading, then a { tier, bump, sub } object. Stable until the page
 * reloads. Treat `null` as "unknown yet" (don't lock prematurely).
 */
export function useTier(): MeResponse | null {
  const [me, setMe] = useState<MeResponse | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: MeResponse) => { if (!cancelled) setMe(data); })
      .catch(() => { if (!cancelled) setMe({ tier: 'free', bump: false }); });
    return () => { cancelled = true; };
  }, []);
  return me;
}
