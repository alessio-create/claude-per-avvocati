import type { Tier } from './token';
import type { CorsoIndex } from './content';
import { lessonKey } from './unlock';

/**
 * Tier-aware access policy. Layered on top of the gem-based lesson chain
 * (see lib/unlock.ts):
 *
 *   - Anonymous / 'free': only Modulo 1 is accessible (all 5 lessons +
 *     esame). Moduli 2..6 are completely paywalled, no teaser lessons.
 *     No certification. Bonus modules (M7..M10) remain gem-unlockable
 *     for anyone, since gems are earned in M1 too.
 *
 *   - 'avvocato' (€79): all 6 core modules + their exams. Certification
 *     available. Bonus modules still gem-gated (no auto-unlock).
 *
 *   - 'studio' / 'studio_plus' (€149+): all 6 core modules + all 4 bonus
 *     modules pre-unlocked (no gem cost). Certification + everything.
 */

const PAID: Tier[] = ['avvocato', 'studio', 'studio_plus'];
const STUDIO_OR_HIGHER: Tier[] = ['studio', 'studio_plus'];

export function isPaid(tier: Tier | null): boolean {
  return tier !== null && PAID.includes(tier);
}

export function hasAllBonus(tier: Tier | null): boolean {
  return tier !== null && STUDIO_OR_HIGHER.includes(tier);
}

export function canAccessCertification(tier: Tier | null): boolean {
  return isPaid(tier);
}

/**
 * Returns true when the user's tier blocks this lesson outright (i.e. the
 * answer is "buy a higher plan", not "complete the previous lesson").
 */
export function isTierLocked(
  index: CorsoIndex,
  moduloSlug: string,
  lezioneSlug: string,
  tier: Tier | null,
): boolean {
  const mod = index.moduli.find((m) => m.slug === moduloSlug);
  if (!mod) return true;

  // Bonus modules: pre-unlocked for studio+, otherwise gem-spend (handled
  // elsewhere). Tier alone never tier-locks a bonus — the user can grind
  // gems even on free, even if they won't get certification.
  if (mod.bonus) return false;

  // Core modules
  if (isPaid(tier)) return false; // any paid tier unlocks all 6 core

  // Free / anonymous: only M1 is reachable. M2..M6 are entirely paywalled,
  // including their first lesson (no teasers).
  return mod.ordine !== 1;
}

export const lessonAccessKey = lessonKey;
