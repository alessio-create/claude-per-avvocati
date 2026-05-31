/**
  * Gems gamification layer.
  *
  * Tracks user progress with awards:
  * - 1 gem on first read of a lesson (rewardRead)
  * - 3 gems on first quiz pass (rewardQuizPass)
  * - 10 gems bonus on first module completion (all lessons in module passed)
  *
  * Storage: localStorage only. No server-side. Identity is per-device.
  * This is a fun layer security irrelevant.
  */

export interface GemsState {
  total: number;
  reads: string[]; // lesson keys "modulo/lezione" already counted for read reward
  quizPasses: string[]; // lesson keys with quiz already passed
  moduleBonuses: string[]; // module slugs already bonus-awarded
  /** Set once the final certification quiz is passed. The `nome` is captured
   *  immediately before submitting and is intentionally immutable — it goes on
   *  the printed certificate, so a typo correction would invalidate prior copies. */
  certificazione?: { passedAt: string; punteggio: number; nome: string };
  /** Module slugs unlocked by spending gems (bonus modules). */
  bonusUnlocks?: string[];
  /** Optional placement-test result; unlocks N preceding core modules. */
  placement?: { livello: 1 | 2 | 3; passedAt: string };
}

const KEY = 'cpa_gems_v1';

const empty: GemsState = {
  total: 0,
  reads: [],
  quizPasses: [],
  moduleBonuses: [],
  bonusUnlocks: [],
};

function read(): GemsState {
  if (typeof localStorage === 'undefined') return { ...empty };
  const raw = localStorage.getItem(KEY);
  if (!raw) return { ...empty };
  try {
    return JSON.parse(raw) as GemsState;
  } catch {
    return { ...empty };
  }
}

function write(s: GemsState) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(s));
  // Notify listeners (Gems widget) that state changed
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cpa-gems-changed', { detail: s }));
  }
}

export function getGems(): GemsState {
  return read();
}

const lessonKey = (modulo: string, lezione: string) => `${modulo}/${lezione}`;

/** Award 1 gem on first read of a lesson. Idempotent. Returns true if newly awarded. */
export function rewardRead(modulo: string, lezione: string): boolean {
  const s = read();
  const key = lessonKey(modulo, lezione);
  if (s.reads.includes(key)) return false;
  s.reads.push(key);
  s.total += 1;
  write(s);
  return true;
}

/** Award 3 gems on first quiz pass. Idempotent. Returns true if newly awarded. */
export function rewardQuizPass(modulo: string, lezione: string): boolean {
  const s = read();
  const key = lessonKey(modulo, lezione);
  if (s.quizPasses.includes(key)) return false;
  s.quizPasses.push(key);
  s.total += 3;
  write(s);
  return true;
}

/** Award a random 5–10 gems on first exam pass. Idempotent. Returns the
 *  number of gems awarded (0 when this exam was already passed). */
export function rewardEsamePass(modulo: string, lezione: string): number {
  const s = read();
  const key = lessonKey(modulo, lezione);
  if (s.quizPasses.includes(key)) return 0;
  const gems = 5 + Math.floor(Math.random() * 6); // 5..10 inclusive
  s.quizPasses.push(key);
  s.total += gems;
  write(s);
  return gems;
}

/** Award 10 gems on first time all lessons in a module are quiz-passed. Idempotent. */
export function rewardModuleComplete(moduloSlug: string, allLessonKeysInModule: string[]): boolean {
  const s = read();
  if (s.moduleBonuses.includes(moduloSlug)) return false;
  const allPassed = allLessonKeysInModule.every((k) => s.quizPasses.includes(k));
  if (!allPassed) return false;
  s.moduleBonuses.push(moduloSlug);
  s.total += 10;
  write(s);
  return true;
}

export function hasPassedQuiz(modulo: string, lezione: string): boolean {
  return read().quizPasses.includes(lessonKey(modulo, lezione));
}

export function hasReadLesson(modulo: string, lezione: string): boolean {
  return read().reads.includes(lessonKey(modulo, lezione));
}

/** Award 50 gems on first time the final certification is passed. Idempotent.
 *  Persists the candidate's name as part of the certificate record; once set,
 *  it is not overwritten on subsequent calls. */
export function rewardCertificazione(punteggio: number, nome: string): boolean {
  const s = read();
  if (s.certificazione) return false;
  s.certificazione = { passedAt: new Date().toISOString(), punteggio, nome };
  s.total += 50;
  write(s);
  return true;
}

export function hasCertificazione(): boolean {
  return !!read().certificazione;
}

/** Returns the stored certification record (name, passedAt, punteggio) or null. */
export function getCertificazione(): { passedAt: string; punteggio: number; nome: string } | null {
  return read().certificazione ?? null;
}

/**
  * Spend gems to unlock a bonus module. Idempotent returns false if
  * already unlocked or not enough gems.
  */
export function spendOnBonus(moduloSlug: string, costo: number): { ok: boolean; reason?: 'already-unlocked' | 'not-enough' } {
  const s = read();
  const unlocked = s.bonusUnlocks ?? [];
  if (unlocked.includes(moduloSlug)) return { ok: false, reason: 'already-unlocked' };
  if (s.total < costo) return { ok: false, reason: 'not-enough' };
  s.total -= costo;
  s.bonusUnlocks = [...unlocked, moduloSlug];
  write(s);
  return { ok: true };
}

export function hasBonusUnlocked(moduloSlug: string): boolean {
  return (read().bonusUnlocks ?? []).includes(moduloSlug);
}

/**
  * Record the placement test result. `livello` indicates how many of the first
  * core modules (M1..M{livello}) to mark as auto-completed (read + quiz-passed),
  * so the user can start at the right point without doing redundant lessons.
  * Idempotent on a per-user basis (first run wins).
  */
export function recordPlacement(livello: 1 | 2 | 3, autoCompletedLessonKeys: string[]): boolean {
  const s = read();
  if (s.placement) return false;
  s.placement = { livello, passedAt: new Date().toISOString() };
  for (const k of autoCompletedLessonKeys) {
    if (!s.reads.includes(k)) s.reads.push(k);
    if (!s.quizPasses.includes(k)) s.quizPasses.push(k);
  }
  write(s);
  return true;
}

export function hasPlacement(): boolean {
  return !!read().placement;
}

/** Reset everything useful for testing or "restart course" feature */
export function resetGems(): void {
  write({ ...empty });
}
