import type { CorsoIndex } from './content';

/**
  * Unlock logic for lessons and modules.
  *
  * Rules (matching user-facing copy on /corso):
  *
  * - Core module 01 is fully open from the start (no prerequisites).
  * - For every other module core or bonus the **first lesson** is always
  *  unlocked as a teaser. Lessons 2..N require the previous lesson to be
  *  "complete":
  *   • if previous has a quiz → must be quiz-passed
  *   • if previous has no quiz → must be marked as read
  * - Bonus modules (module.bonus === true) require a gem unlock before *any*
  *  of their lessons can be opened including the teaser.
  *
  * Read state and bonus-unlock state come in as Sets so callers can pass live
  * client-side data without re-querying localStorage per lesson.
  */
export interface UnlockState {
  reads: Set<string>;
  quizPasses: Set<string>;
  bonusUnlocks: Set<string>;
}

export const lessonKey = (modulo: string, lezione: string) => `${modulo}/${lezione}`;

/** Returns true when the user must spend gems before this module's lessons open. */
export function isBonusModuleLocked(
  index: CorsoIndex,
  moduloSlug: string,
  state: UnlockState,
): boolean {
  const mod = index.moduli.find((m) => m.slug === moduloSlug);
  if (!mod || !mod.bonus) return false;
  return !state.bonusUnlocks.has(moduloSlug);
}

/** Returns true when this lesson is locked for the user. */
export function isLessonLocked(
  index: CorsoIndex,
  moduloSlug: string,
  lezioneSlug: string,
  state: UnlockState,
): boolean {
  const mod = index.moduli.find((m) => m.slug === moduloSlug);
  if (!mod) return true;

  // Bonus module → wholesale gated by gem unlock
  if (mod.bonus && !state.bonusUnlocks.has(moduloSlug)) return true;

  // First lesson of any module is always unlocked (teaser)
  if (mod.lezioni[0]?.slug === lezioneSlug) return false;

  // Otherwise: previous lesson must be complete
  const flat: { modulo: string; lezione: string; hasQuiz: boolean }[] = [];
  for (const m of index.moduli)
    for (const l of m.lezioni)
      flat.push({ modulo: m.slug, lezione: l.slug, hasQuiz: l.quiz });
  const i = flat.findIndex((x) => x.modulo === moduloSlug && x.lezione === lezioneSlug);
  if (i <= 0) return false;
  const prev = flat[i - 1];
  const k = lessonKey(prev.modulo, prev.lezione);
  return prev.hasQuiz ? !state.quizPasses.has(k) : !state.reads.has(k);
}

/** For a given lesson, return the "previous lesson" the LessonGate should check, or null if always-open. */
export function previousGateLesson(
  index: CorsoIndex,
  moduloSlug: string,
  lezioneSlug: string,
): { modulo: string; lezione: string; titolo: string; hasQuiz: boolean } | null {
  const mod = index.moduli.find((m) => m.slug === moduloSlug);
  if (!mod) return null;
  // First lesson of a module is always open → no previous gate
  if (mod.lezioni[0]?.slug === lezioneSlug) return null;
  const flat: { modulo: string; lezione: string; titolo: string; hasQuiz: boolean }[] = [];
  for (const m of index.moduli)
    for (const l of m.lezioni)
      flat.push({ modulo: m.slug, lezione: l.slug, titolo: l.titolo, hasQuiz: l.quiz });
  const i = flat.findIndex((x) => x.modulo === moduloSlug && x.lezione === lezioneSlug);
  return i > 0 ? flat[i - 1] : null;
}
