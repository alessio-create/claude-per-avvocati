'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { hasPassedQuiz } from '../../lib/gems';
import { LockIcon } from '../illustration/LockIcon';
import type { CorsoIndex } from '../../lib/content';

export function LessonNav({
  index, modulo, lezione, hasQuiz,
}: { index: CorsoIndex; modulo: string; lezione: string; hasQuiz: boolean }) {
  const flat: { modulo: string; lezione: string; titolo: string }[] = [];
  for (const m of index.moduli) for (const l of m.lezioni) flat.push({ modulo: m.slug, lezione: l.slug, titolo: l.titolo });
  const i = flat.findIndex(x => x.modulo === modulo && x.lezione === lezione);
  const prev = i > 0 ? flat[i - 1] : null;
  const next = i < flat.length - 1 ? flat[i + 1] : null;

  // Gate next only when the lesson has a quiz; passes once passed
  const [unlocked, setUnlocked] = useState(!hasQuiz);
  useEffect(() => {
    if (!hasQuiz) { setUnlocked(true); return; }
    const refresh = () => setUnlocked(hasPassedQuiz(modulo, lezione));
    refresh();
    window.addEventListener('cpa-gems-changed', refresh);
    return () => window.removeEventListener('cpa-gems-changed', refresh);
  }, [hasQuiz, modulo, lezione]);

  return (
    <nav className="flex flex-col sm:flex-row sm:justify-between sm:items-start mt-10 sm:mt-12 pt-6 border-t border-line text-sm gap-4">
      {prev ? (
        <Link
          href={`/corso/${prev.modulo}/${prev.lezione}`}
          className="text-terracotta hover:underline inline-flex items-start gap-1 max-w-full sm:max-w-[45%]"
        >
          <span aria-hidden>←</span>
          <span className="break-words">{prev.titolo}</span>
        </Link>
      ) : <span className="hidden sm:block" />}

      {next ? (
        unlocked ? (
          <Link
            href={`/corso/${next.modulo}/${next.lezione}`}
            className="text-terracotta hover:underline inline-flex items-start gap-1 max-w-full sm:max-w-[45%] sm:text-right sm:flex-row-reverse"
          >
            <span aria-hidden>→</span>
            <span className="break-words">{next.titolo}</span>
          </Link>
        ) : (
          <div className="sm:text-right max-w-full sm:max-w-[45%]">
            <span className="text-muted text-[11px] inline-flex items-center gap-1 leading-tight">
              <LockIcon size={11} className="text-muted" />
              Supera la verifica per sbloccare
            </span>
            <div className="text-muted opacity-60 text-sm break-words">{next.titolo}</div>
          </div>
        )
      ) : <span className="hidden sm:block" />}
    </nav>
  );
}
