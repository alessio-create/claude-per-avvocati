'use client';
import { useEffect, useState } from 'react';
import { getGems } from '../../lib/gems';
import { computeCourseStats } from '../../lib/progress';
import { ClaudeStar } from '../illustration/ClaudeStar';
import type { CorsoIndex } from '../../lib/content';

/**
 * PioneerCelebration: hero card shown on the course index when the user has
 * reached Pioneer status (Lv 5 in the MeccanismoPyramid framing).
 *
 * Criteria (see computeCourseStats):
 *  - All core lessons read
 *  - All core esami passed
 *  - Final certification cleared
 *
 * Renders nothing if not yet Pioneer. When Pioneer, hides the regular
 * "Inizia da zero / Test di livello" hero cards (the caller should branch
 * on the same `isPioneer` value to avoid duplicating CTAs).
 */
export function PioneerCelebration({ index }: { index: CorsoIndex }) {
  const [isPioneer, setIsPioneer] = useState(false);
  const [achievedAt, setAchievedAt] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      const g = getGems();
      const stats = computeCourseStats(index, g);
      setIsPioneer(stats.isPioneer);
      setAchievedAt(g.certificazione?.passedAt ?? null);
    };
    refresh();
    window.addEventListener('cpa-gems-changed', refresh);
    return () => window.removeEventListener('cpa-gems-changed', refresh);
  }, [index]);

  if (!isPioneer) return null;

  const date = achievedAt
    ? new Date(achievedAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <section className="mb-10 relative overflow-hidden rounded-2xl border-2 border-terracotta bg-gradient-to-br from-ink via-[#1f1714] to-ink text-cream p-8 sm:p-10 shadow-2xl">
      {/* Decorative glow */}
      <div
        aria-hidden
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(217,119,87,0.35), transparent 65%)' }}
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -left-16 w-60 h-60 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(217,119,87,0.18), transparent 65%)' }}
      />

      {/* Floating decorative stars */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {[
          { top: '15%', left: '88%', s: 12, delay: '0s' },
          { top: '70%', left: '92%', s: 8,  delay: '1.2s' },
          { top: '25%', left: '8%',  s: 10, delay: '0.6s' },
          { top: '78%', left: '12%', s: 9,  delay: '1.8s' },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute cpa-pioneer-twinkle"
            style={{ top: p.top, left: p.left, animationDelay: p.delay }}
          >
            <ClaudeStar size={p.s} className="text-terracotta-soft" />
          </span>
        ))}
      </div>

      <div className="relative grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-8 items-center">
        <div className="flex justify-center sm:justify-start">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -m-3 rounded-full cpa-pioneer-pulse"
              style={{ background: 'radial-gradient(circle, rgba(217,119,87,0.55), transparent 70%)' }}
            />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-terracotta to-[#a8512e] flex items-center justify-center shadow-xl">
              <ClaudeStar size={56} className="text-white" />
            </div>
          </div>
        </div>

        <div className="text-center sm:text-left">
          <div className="text-[10px] uppercase tracking-widest text-terracotta-soft font-bold mb-1">
            Livello 5 · Pioniere
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mb-3 text-cream">
            Sei un <span className="text-terracotta italic">Claude Pioneer</span>.
          </h2>
          <p className="text-sm sm:text-base text-muted leading-snug max-w-xl mb-4">
            Hai completato tutti i sei moduli core, superato gli esami, e ottenuto la certificazione finale.
            Sei tra i pochi avvocati italiani che padroneggiano Claude end-to-end nella pratica legale.
            {date && <span className="block text-[11px] text-muted/70 mt-2">Certificato il {date}.</span>}
          </p>
          <div className="flex gap-3 justify-center sm:justify-start flex-wrap">
            <a
              href="/corso/certificazione"
              className="inline-flex items-center gap-2 bg-terracotta text-white font-bold px-5 py-2.5 rounded-md text-sm hover:bg-terracotta/90 transition-colors"
            >
              Rivedi il certificato
            </a>
            <a
              href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fclaudeperavvocati.it"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-terracotta-soft/40 text-terracotta-soft font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#2e2922] transition-colors"
            >
              Condividi su LinkedIn
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cpa-pioneer-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.55; }
          50%      { transform: scale(1.15); opacity: 0.9;  }
        }
        .cpa-pioneer-pulse { animation: cpa-pioneer-pulse 3.4s ease-in-out infinite; }

        @keyframes cpa-pioneer-twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.25); }
        }
        .cpa-pioneer-twinkle { animation: cpa-pioneer-twinkle 2.8s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

/**
 * Lightweight client helper used by /corso index to know whether to hide
 * the regular hero cards. Same hook shape as PioneerCelebration so the
 * two stay in sync.
 */
export function useIsPioneer(index: CorsoIndex): boolean {
  const [isPioneer, setIsPioneer] = useState(false);
  useEffect(() => {
    const refresh = () => setIsPioneer(computeCourseStats(index, getGems()).isPioneer);
    refresh();
    window.addEventListener('cpa-gems-changed', refresh);
    return () => window.removeEventListener('cpa-gems-changed', refresh);
  }, [index]);
  return isPioneer;
}
