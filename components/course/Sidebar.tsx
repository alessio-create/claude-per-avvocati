'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ClaudeStar } from '../illustration/ClaudeStar';
import { LockIcon } from '../illustration/LockIcon';
import { EsameBadge } from './EsameBadge';
import { GemsWidget } from './GemsWidget';
import { CourseStatsChip } from './CourseStatsChip';
import { CourseSearch } from './CourseSearch';
import { BonusUnlockTile } from './BonusUnlockTile';
import { getGems } from '../../lib/gems';
import { isLessonLocked, isBonusModuleLocked } from '../../lib/unlock';
import { isTierLocked, hasAllBonus } from '../../lib/access';
import { useTier } from '../../lib/use-tier';
import type { CorsoIndex } from '../../lib/content';

export function Sidebar({
  index,
  activeModulo,
  activeLezione,
}: { index: CorsoIndex; activeModulo?: string; activeLezione?: string }) {
  const [reads, setReads] = useState<Set<string>>(new Set());
  const [passes, setPasses] = useState<Set<string>>(new Set());
  const [bonusUnlocks, setBonusUnlocks] = useState<Set<string>>(new Set());
  const me = useTier();
  const tier = me?.tier ?? null;

  useEffect(() => {
    const refresh = () => {
      const g = getGems();
      setReads(new Set(g.reads));
      setPasses(new Set(g.quizPasses));
      // studio tier: all bonus modules pre-unlocked even without gem spend
      const baseUnlocks = new Set(g.bonusUnlocks ?? []);
      if (hasAllBonus(tier)) {
        index.moduli.filter((m) => m.bonus).forEach((m) => baseUnlocks.add(m.slug));
      }
      setBonusUnlocks(baseUnlocks);
    };
    refresh();
    window.addEventListener('cpa-gems-changed', refresh);
    return () => window.removeEventListener('cpa-gems-changed', refresh);
  }, [tier, index.moduli]);

  const unlockState = { reads, quizPasses: passes, bonusUnlocks };

  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  // "NUOVO" badge on Tour del corso disappears the first time the user clicks it.
  // Stored separately from the gems state so it survives gem reset.
  const TOUR_KEY = 'cpa_tour_clicked_v1';
  const [tourClicked, setTourClicked] = useState(true); // default true to avoid SSR flash
  useEffect(() => {
    try { setTourClicked(localStorage.getItem(TOUR_KEY) === '1'); } catch { /* ignore */ }
  }, []);
  const markTourClicked = () => {
    setTourClicked(true);
    try { localStorage.setItem(TOUR_KEY, '1'); } catch { /* ignore */ }
  };

  return (
    <>
      {/* Mobile-only top bar with hamburger trigger. */}
      <div className="md:hidden sticky top-0 z-20 flex items-center justify-between bg-cream-panel border-b border-line px-4 py-3">
        <Link href="/corso" className="flex items-center gap-2 font-bold text-terracotta text-sm">
          <ClaudeStar size={16} />
          Claude per Avvocati
        </Link>
        <button
          type="button"
          aria-label={mobileOpen ? 'Chiudi indice corso' : 'Apri indice corso'}
          onClick={() => setMobileOpen((v) => !v)}
          className="w-9 h-9 rounded-md border border-line bg-white flex items-center justify-center text-ink"
        >
          {mobileOpen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6 L18 18 M18 6 L6 18" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 7 H21 M3 12 H21 M3 17 H21" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        onClick={(e) => {
          // Close drawer when clicking a Link inside it (on mobile)
          if (mobileOpen && (e.target as HTMLElement).closest('a[href^="/corso/"]')) {
            setMobileOpen(false);
          }
        }}
        className={`shrink-0 border-r border-line bg-cream-panel p-4 overflow-y-auto
          md:w-[260px] md:sticky md:top-0 md:h-screen md:translate-x-0
          fixed top-0 bottom-0 left-0 z-40 w-[80vw] max-w-[300px] transition-transform
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}
      >
      <Link href="/corso" className="flex items-center gap-2 mb-4 font-bold text-terracotta">
        <ClaudeStar size={18} />
        Claude per Avvocati
      </Link>

      {/* Compact progress + search, consolidated from the old wide top bar. */}
      <div className="mb-4 space-y-2">
        <CourseStatsChip index={index} />
        <CourseSearch index={index} />
      </div>

      <GemsWidget />

      <div className="mt-5">
        <div className="mb-4">
          <Link
            href="/corso/benvenuto"
            onClick={markTourClicked}
            className="relative flex items-center justify-between gap-2 py-1.5 px-2 rounded-md text-[11px] text-terracotta font-semibold hover:bg-cream"
          >
            <span>Tour del corso (3 min)</span>
            {!tourClicked && (
              <span className="inline-flex items-center gap-1 bg-terracotta text-white px-1.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold animate-pulse shadow-sm">
                Nuovo
              </span>
            )}
          </Link>
          <Link
            href="/corso/placement-test"
            className="flex items-center gap-2 py-1.5 px-2 rounded-md text-[11px] text-muted hover:text-terracotta hover:bg-cream"
          >
            Test di livello iniziale
          </Link>
        </div>

        {index.moduli.map((m) => {
          const bonusLocked = isBonusModuleLocked(index, m.slug, unlockState);

          // Locked bonus modules render as a click-to-expand purchase tile
          // (gem-spend or upgrade to Studio) instead of a static lesson list.
          // Studio-tier users never see this branch, hasAllBonus() unlocks them.
          if (m.bonus && bonusLocked) {
            return <BonusUnlockTile key={m.slug} m={m} />;
          }

          return (
            <div key={m.slug} className="mb-4">
              <div className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-1 flex items-center gap-1.5">
                <span>{String(m.ordine).padStart(2, '0')} · {m.titolo}</span>
                {m.bonus && (
                  <span className="text-terracotta normal-case tracking-normal text-[9px] font-bold">
                    · sbloccato
                  </span>
                )}
              </div>
              <ul className="space-y-0.5">
                {m.lezioni.map((l) => {
                  const key = `${m.slug}/${l.slug}`;
                  const active = m.slug === activeModulo && l.slug === activeLezione;
                  const passed = passes.has(key);
                  const lockedByChain = isLessonLocked(index, m.slug, l.slug, unlockState);
                  const lockedByTier = isTierLocked(index, m.slug, l.slug, tier);
                  const locked = lockedByChain || lockedByTier;
                  const isExam = l.tipo === 'esame';

                  const labelClasses = active
                    ? 'text-terracotta font-semibold'
                    : locked
                      ? 'text-muted/45 cursor-not-allowed'
                      : 'text-muted hover:text-ink';
                  const examEmphasis = isExam ? ' uppercase tracking-wide text-[10px] font-semibold' : '';

                  const row = (
                    <span className={`flex items-start gap-1.5 py-1 pl-2 text-[11px] leading-tight ${labelClasses}${examEmphasis}`}>
                      <span className="shrink-0 mt-[1px] w-3 inline-flex items-center justify-center">
                        {locked ? (
                          <LockIcon size={11} className="text-muted/55" />
                        ) : passed ? (
                          <span className="text-[#6fa28b]">✓</span>
                        ) : isExam ? (
                          <EsameBadge size={12} className="text-terracotta/70" />
                        ) : (
                          <span className="text-line">○</span>
                        )}
                      </span>
                      <span className="flex-1">{l.titolo}</span>
                    </span>
                  );

                  const tip = lockedByTier
                    ? 'Piano richiesto: Avvocato (€79) o Studio (€149)'
                    : bonusLocked
                      ? `Modulo bonus, sblocca con ${m.costoGemme ?? 50} ✦ (incluso in Studio)`
                      : 'Completa la lezione precedente';

                  return (
                    <li key={l.slug}>
                      {locked ? (
                        <div aria-disabled="true" title={tip}>
                          {row}
                        </div>
                      ) : (
                        <Link href={`/corso/${m.slug}/${l.slug}`}>{row}</Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {/* Prova finale: dedicated card at the bottom, after all modules */}
        <Link
          href="/corso/certificazione"
          className={`mt-2 block rounded-md border-2 p-3 transition-colors ${
            activeModulo === 'certificazione'
              ? 'border-terracotta bg-terracotta text-white'
              : 'border-terracotta bg-white hover:bg-cream'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <EsameBadge size={14} className={activeModulo === 'certificazione' ? 'text-white' : 'text-terracotta'} />
            <span className={`text-[10px] uppercase tracking-widest font-bold ${activeModulo === 'certificazione' ? 'text-white' : 'text-terracotta'}`}>
              Prova finale
            </span>
          </div>
          <div className={`font-serif font-bold text-sm leading-tight mb-0.5 ${activeModulo === 'certificazione' ? 'text-white' : 'text-ink'}`}>
            Certificazione
          </div>
          <div className={`text-[10px] leading-snug ${activeModulo === 'certificazione' ? 'text-white/85' : 'text-muted'}`}>
            9 domande · 1 per modulo · +50 ✦ + LinkedIn
          </div>
        </Link>
      </div>
    </aside>
    </>
  );
}
