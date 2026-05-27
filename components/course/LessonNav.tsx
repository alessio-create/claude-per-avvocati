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
    <nav className="flex justify-between items-start mt-12 pt-6 border-t border-line text-sm gap-4">
      {prev ? (
        <Link href={`/corso/${prev.modulo}/${prev.lezione}`} className="text-terracotta hover:underline">
          ← {prev.titolo}
        </Link>
      ) : <span />}

      {next ? (
        unlocked ? (
          <Link href={`/corso/${next.modulo}/${next.lezione}`} className="text-terracotta hover:underline text-right">
            {next.titolo} →
          </Link>
        ) : (
          <div className="text-right">
            <span className="text-muted text-[11px] inline-flex items-center justify-end gap-1 leading-tight">
              <LockIcon size={11} className="text-muted" />
              Supera la verifica per sbloccare
            </span>
            <div className="text-muted opacity-60 text-sm">{next.titolo}</div>
          </div>
        )
      ) : <span />}
    </nav>
  );
}
