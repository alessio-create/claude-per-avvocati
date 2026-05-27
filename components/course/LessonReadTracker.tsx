'use client';
import { useEffect } from 'react';
import { rewardRead, rewardModuleComplete } from '../../lib/gems';
import { setLastVisited } from '../../lib/progress';

/**
  * Lives inside the lesson page. On mount, awards the read gem (idempotent),
  * sets last-visited, and checks if any module just became fully complete.
  */
export function LessonReadTracker({
  modulo,
  lezione,
  moduleAllLessonKeys,
}: {
  modulo: string;
  lezione: string;
  moduleAllLessonKeys: string[];
}) {
  useEffect(() => {
    rewardRead(modulo, lezione);
    setLastVisited(modulo, lezione);
    rewardModuleComplete(modulo, moduleAllLessonKeys);
    // Snap to the top of the lesson on every navigation. Without this, App
    // Router preserves scroll for soft transitions between the same dynamic
    // route, so the reader can land on the LessonNav at the bottom instead
    // of the lesson opening.
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [modulo, lezione, moduleAllLessonKeys]);

  return null;
}
