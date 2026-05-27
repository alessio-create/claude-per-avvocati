'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getGems, spendOnBonus } from '../../lib/gems';
import { LockIcon } from '../illustration/LockIcon';
import type { Module } from '../../lib/content';

/**
 * Renders a locked bonus module as a compact, clickable tile in the sidebar.
 * Collapsed: a single row with the module title + gem cost pill.
 * Expanded: an inline card with gem progress, "Sblocca con X ✦" button
 * (disabled until the user has enough gems), and a "Passa a Studio" upgrade
 * link. The same UX as the full-page LessonGate bonus card, just shrunk to
 * the 240px sidebar width so users can buy from where they discover the lock.
 */
export function BonusUnlockTile({ m }: { m: Module }) {
  const [expanded, setExpanded] = useState(false);
  const [gemTotal, setGemTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setGemTotal(getGems().total);
    refresh();
    window.addEventListener('cpa-gems-changed', refresh);
    return () => window.removeEventListener('cpa-gems-changed', refresh);
  }, []);

  const cost = m.costoGemme ?? 50;
  const enough = gemTotal >= cost;
  const percent = Math.min(100, Math.round((gemTotal / cost) * 100));

  const handleSpend = () => {
    setError(null);
    const result = spendOnBonus(m.slug, cost);
    if (!result.ok) {
      setError(
        result.reason === 'not-enough'
          ? `Mancano ${cost - gemTotal} ✦.`
          : 'Già sbloccato.',
      );
    }
  };

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md border transition-colors ${
          expanded
            ? 'border-terracotta bg-cream'
            : 'border-dashed border-line bg-cream-panel hover:border-terracotta'
        }`}
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <LockIcon size={11} className="text-muted/70 shrink-0" />
          <span className="text-[10px] uppercase tracking-widest text-muted font-semibold truncate">
            {String(m.ordine).padStart(2, '0')} · {m.titolo}
          </span>
        </span>
        <span className="inline-flex items-center gap-1 bg-terracotta text-white rounded-full px-1.5 py-0.5 text-[9px] font-bold tabular-nums shrink-0">
          {cost} ✦
        </span>
      </button>

      {expanded && (
        <div className="mt-2 rounded-md border-2 border-terracotta bg-white p-3">
          <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">
            Modulo bonus
          </div>
          <p className="text-[11px] text-body leading-snug m-0 mb-3">{m.sottotitolo}</p>

          {/* Gem progress */}
          <div className="mb-3">
            <div className="flex items-baseline justify-between text-[10px] mb-1">
              <span className="text-muted tabular-nums">
                {gemTotal} ✦ <span className="text-muted/50">/</span> {cost} ✦
              </span>
              <span className={`font-bold tabular-nums ${enough ? 'text-[#6fa28b]' : 'text-muted'}`}>
                {percent}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-cream-panel overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${enough ? 'bg-[#6fa28b]' : 'bg-terracotta'}`}
                style={{ width: `${percent}%` }}
                aria-hidden
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSpend}
            disabled={!enough}
            className="w-full rounded-md bg-terracotta text-white px-3 py-1.5 text-[11px] font-bold disabled:bg-line disabled:text-muted disabled:cursor-not-allowed mb-2"
          >
            {enough ? `Sblocca con ${cost} ✦` : `Servono ancora ${cost - gemTotal} ✦`}
          </button>

          <Link
            href="/checkout?tier=avvocato"
            className="block text-center rounded-md border border-line bg-cream-panel px-3 py-1.5 text-[11px] font-semibold text-ink hover:border-terracotta hover:text-terracotta"
          >
            Passa ad Avvocato · €79 (include 1 bonus)
          </Link>

          {error && (
            <p className="text-[10px] text-terracotta mt-2 m-0">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
