'use client';
import Link from 'next/link';
import { useTier } from '../../lib/use-tier';

/**
 * Hero/FinalCTA primary call-to-action row, tier-aware.
 *
 * - Anonymous visitors see the standard "Inizia col Modulo 1 gratis" entry
 *   plus a small "Accedi" link below for returning users who landed on a
 *   new device or cleared cookies.
 * - Authenticated visitors (any tier, including free signups, detected via
 *   `sub` on /api/me) skip the signup loop and land on a "Vai al corso"
 *   primary, with "Vedi i piani" still available in case they want to
 *   upgrade from free to paid.
 *
 * Both Hero and FinalCTA use this. The `glow` flag adds the anim-glow ring
 * around the primary (Hero only).
 */
export function HeroCTAs({ glow = false }: { glow?: boolean }) {
  const me = useTier();
  // While tier resolves, render the anonymous variant. It's the safe default
  // (a returning user briefly seeing "Inizia gratis" resolves in <300ms).
  const signedIn = Boolean(me?.sub);

  const primaryClass = `flex-1 sm:flex-none text-center bg-terracotta text-white px-6 sm:px-7 py-3 rounded font-bold text-sm shadow-lg ${glow ? 'anim-glow' : ''}`;
  const secondaryClass = 'flex-1 sm:flex-none text-center border border-line bg-white text-ink px-5 py-3 rounded font-semibold text-sm hover:border-terracotta hover:text-terracotta transition-colors';

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex gap-3 justify-center items-center flex-wrap w-full max-w-sm sm:max-w-none">
        {signedIn ? (
          <>
            <Link href="/corso" className={primaryClass}>
              Vai al corso →
            </Link>
            <Link href="/#prezzi" className={secondaryClass}>
              Vedi i piani
            </Link>
          </>
        ) : (
          <>
            <Link href="/iscriviti-gratis" className={primaryClass}>
              Inizia col Modulo 1 gratis →
            </Link>
            <Link href="/#prezzi" className={secondaryClass}>
              Vedi i piani
            </Link>
          </>
        )}
      </div>

      {/* Small returning-user link, only shown for visitors who aren't already
          signed in. Avoids forcing existing users back through the magic-link
          signup just because they're on a new device or cleared cookies. */}
      {!signedIn && (
        <p className="text-[11px] text-muted mt-1">
          Hai già accesso?{' '}
          <Link href="/sblocca" className="text-terracotta font-semibold hover:underline">
            Accedi
          </Link>
        </p>
      )}
    </div>
  );
}
