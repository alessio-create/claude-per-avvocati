export interface Progress {
  completed: string[];
  lastVisited: { modulo: string; lezione: string } | null;
}

const KEY = 'cpa_progress_v1';

function read(): Progress {
  if (typeof localStorage === 'undefined') return { completed: [], lastVisited: null };
  const raw = localStorage.getItem(KEY);
  if (!raw) return { completed: [], lastVisited: null };
  try { return JSON.parse(raw) as Progress; }
  catch { return { completed: [], lastVisited: null }; }
}

function write(p: Progress) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function getProgress(): Progress { return read(); }

export function markCompleted(modulo: string, lezione: string) {
  const p = read();
  const key = `${modulo}/${lezione}`;
  if (!p.completed.includes(key)) p.completed.push(key);
  write(p);
}

export function setLastVisited(modulo: string, lezione: string) {
  const p = read();
  p.lastVisited = { modulo, lezione };
  write(p);
}

export function isCompleted(modulo: string, lezione: string): boolean {
  return read().completed.includes(`${modulo}/${lezione}`);
}

/* -------------------------------------------------------------------------- */
/*  Course-wide aggregate stats                                               */
/*  Used by the sticky progress bar and the Pioneer reveal.                   */
/* -------------------------------------------------------------------------- */

import type { CorsoIndex } from './content';
import type { GemsState } from './gems';

export interface CourseStats {
  /** Lessons read in CORE modules (M1..M6, no bonus, no esami). */
  coreLessonsRead: number;
  coreLessonsTotal: number;
  /** Exams passed in CORE modules. */
  coreExamsPassed: number;
  coreExamsTotal: number;
  /** Percent of core path completed (0..100), weighted equally between
   *  lessons and exams. */
  corePercent: number;
  /** Bonus modules unlocked (M7..M10). */
  bonusUnlocked: number;
  bonusTotal: number;
  /** Final certification cleared. */
  hasCertificazione: boolean;
  /** Pioneer = all core lessons read + all core exams passed + certification. */
  isPioneer: boolean;
}

const isExam = (slug: string) => slug.startsWith('99-');

export function computeCourseStats(index: CorsoIndex, gems: GemsState): CourseStats {
  const reads = new Set(gems.reads);
  const passes = new Set(gems.quizPasses);
  const bonusUnlocks = new Set(gems.bonusUnlocks ?? []);

  const core = index.moduli.filter((m) => !m.bonus);
  const bonus = index.moduli.filter((m) => m.bonus);

  let coreLessonsRead = 0;
  let coreLessonsTotal = 0;
  let coreExamsPassed = 0;
  let coreExamsTotal = 0;

  for (const m of core) {
    for (const l of m.lezioni) {
      const key = `${m.slug}/${l.slug}`;
      const exam = isExam(l.slug) || l.tipo === 'esame';
      if (exam) {
        coreExamsTotal += 1;
        if (passes.has(key)) coreExamsPassed += 1;
      } else {
        coreLessonsTotal += 1;
        if (reads.has(key)) coreLessonsRead += 1;
      }
    }
  }

  // Weight lessons + exams equally; if no exams exist yet, fall back to lessons only.
  const lessonPart = coreLessonsTotal > 0 ? coreLessonsRead / coreLessonsTotal : 0;
  const examPart = coreExamsTotal > 0 ? coreExamsPassed / coreExamsTotal : 0;
  const corePercent = coreExamsTotal > 0
    ? Math.round(((lessonPart + examPart) / 2) * 100)
    : Math.round(lessonPart * 100);

  const bonusTotal = bonus.length;
  const bonusUnlocked = bonus.filter((m) => bonusUnlocks.has(m.slug)).length;

  const hasCertificazione = !!gems.certificazione;
  const isPioneer =
    coreLessonsRead === coreLessonsTotal &&
    coreExamsPassed === coreExamsTotal &&
    coreExamsTotal > 0 &&
    hasCertificazione;

  return {
    coreLessonsRead,
    coreLessonsTotal,
    coreExamsPassed,
    coreExamsTotal,
    corePercent,
    bonusUnlocked,
    bonusTotal,
    hasCertificazione,
    isPioneer,
  };
}
