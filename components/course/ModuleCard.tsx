'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Module } from '../../lib/content';
import { ModuleIcon } from '../illustration/ModuleIcon';
import { LockIcon } from '../illustration/LockIcon';
import { getGems } from '../../lib/gems';

const COVER_BG: Record<string, string> = {
  lilac: 'bg-[#e8defe]',
  sage: 'bg-[#d8e6dc]',
  peach: 'bg-[#fde2cc]',
  lavender: 'bg-[#dad4f0]',
  terracotta: 'bg-[#f4d4c4]',
  mint: 'bg-[#d4ecdf]',
};
const COVER_FG: Record<string, string> = {
  lilac: 'text-[#7a5fb0]',
  sage: 'text-[#4f7a5f]',
  peach: 'text-[#b86b3f]',
  lavender: 'text-[#5e51a0]',
  terracotta: 'text-[#a8512e]',
  mint: 'text-[#3c8a66]',
};

export function ModuleCard({ m, bonus = false }: { m: Module; bonus?: boolean }) {
  const [unlocked, setUnlocked] = useState(!bonus);
  const [gemTotal, setGemTotal] = useState(0);
  const firstLesson = m.lezioni[0];

  useEffect(() => {
    if (!bonus) return;
    const refresh = () => {
      const g = getGems();
      setUnlocked((g.bonusUnlocks ?? []).includes(m.slug));
      setGemTotal(g.total);
    };
    refresh();
    window.addEventListener('cpa-gems-changed', refresh);
    return () => window.removeEventListener('cpa-gems-changed', refresh);
  }, [bonus, m.slug]);

  const bgClass = COVER_BG[m.coloreCover] ?? 'bg-cream-panel';
  const fgClass = COVER_FG[m.coloreCover] ?? 'text-ink';
  const cost = m.costoGemme ?? 50;
  const enough = gemTotal >= cost;
  const showLocked = bonus && !unlocked;

  const body = (
    <div className={`block rounded-lg border bg-white overflow-hidden hover:shadow-md transition-shadow h-full ${
      showLocked ? 'border-line/60' : 'border-line'
    }`}>
      {/* Cover area */}
      <div className={`${bgClass} ${fgClass} h-28 flex items-center justify-center relative overflow-hidden`}>
        <ModuleIcon name={m.icona} size={48} />

        {/* LOCKED state, dark overlay + big lock icon + gem cost */}
        {showLocked && (
          <>
            <div
              className="absolute inset-0 bg-ink/65 backdrop-blur-[1px]"
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-cream gap-1.5">
              <LockIcon size={26} className="text-cream/95" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-cream/90">
                Bloccato
              </span>
            </div>
            <div className="absolute top-2 right-2 bg-terracotta text-white rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums shadow-md">
              {cost} ✦
            </div>
          </>
        )}

        {/* UNLOCKED state for bonus modules */}
        {bonus && unlocked && (
          <div className="absolute top-2 right-2 bg-[#6fa28b] text-white rounded-full px-2 py-0.5 text-[10px] font-bold shadow">
            ✓ sbloccato
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-1">
          {String(m.ordine).padStart(2, '0')} · {m.categoria}
        </div>
        <h4 className="font-serif text-base font-bold leading-tight mb-1">{m.titolo}</h4>
        <p className="text-xs text-muted leading-snug mb-3 line-clamp-2">{m.sottotitolo}</p>

        {showLocked ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted tabular-nums">
                {m.lezioni.length} lezioni · ~{m.durataMinutiPianificati}&apos;
              </span>
              <span className="font-bold text-terracotta tabular-nums">
                {cost} ✦
              </span>
            </div>
            {/* Gem progress meter, makes the unlock distance tangible */}
            <div className="h-1 rounded-full bg-cream-panel overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${enough ? 'bg-[#6fa28b]' : 'bg-terracotta'}`}
                style={{ width: `${Math.min(100, (gemTotal / cost) * 100)}%` }}
                aria-hidden
              />
            </div>
            <div className={`text-[10px] font-semibold leading-snug ${enough ? 'text-[#6fa28b]' : 'text-muted'}`}>
              {enough
                ? `Pronto: hai ${gemTotal} ✦, basta entrare per sbloccarlo`
                : `Hai ${gemTotal} ✦ · ti mancano ${cost - gemTotal} ✦ (o passa al piano Studio)`}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>{m.lezioni.length} lezioni · ~{m.durataMinutiPianificati}&apos;</span>
            <span className="text-terracotta font-semibold">Apri →</span>
          </div>
        )}
      </div>
    </div>
  );

  if (!firstLesson) return body;
  return (
    <Link href={`/corso/${m.slug}/${firstLesson.slug}`} className="block h-full">
      {body}
    </Link>
  );
}
