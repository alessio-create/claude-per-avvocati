'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  CALENDARIO,
  CATEGORIE_GIORNO,
  CATEGORIA_COLORE,
  type CategoriaGiorno,
  type GiornoCalendario,
} from '../../lib/calendario';

const STORAGE_KEY = 'cpa_calendario_v1';

interface CalendarioState {
  done: number[]; // day numbers marked complete
}

function readState(): CalendarioState {
  if (typeof localStorage === 'undefined') return { done: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { done: [] };
    const parsed = JSON.parse(raw) as CalendarioState;
    if (!parsed || !Array.isArray(parsed.done)) return { done: [] };
    return parsed;
  } catch {
    return { done: [] };
  }
}

function writeState(s: CalendarioState) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function Calendario30Giorni() {
  const [done, setDone] = useState<Set<number>>(new Set());
  const [activeCat, setActiveCat] = useState<CategoriaGiorno | 'tutte'>('tutte');

  useEffect(() => {
    setDone(new Set(readState().done));
  }, []);

  const toggleDone = (giorno: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(giorno)) next.delete(giorno);
      else next.add(giorno);
      writeState({ done: Array.from(next).sort((a, b) => a - b) });
      return next;
    });
  };

  const resetAll = () => {
    setDone(new Set());
    writeState({ done: [] });
  };

  const completedCount = done.size;
  const percent = Math.round((completedCount / CALENDARIO.length) * 100);

  // For the grid view, optionally filter by category
  const visible = useMemo(() => {
    if (activeCat === 'tutte') return CALENDARIO;
    return CALENDARIO.filter((g) => g.categoria === activeCat);
  }, [activeCat]);

  return (
    <div>
      {/* Progress summary */}
      <div className="mb-6 rounded-xl border border-line bg-white p-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-3xl font-bold text-terracotta tabular-nums">
            {completedCount}<span className="text-muted/50">/30</span>
          </span>
          <span className="text-xs uppercase tracking-widest text-muted font-semibold">
            giorni completati · {percent}%
          </span>
        </div>
        <div className="flex-1 min-w-[140px] max-w-md">
          <div className="h-2 bg-cream-panel rounded-full overflow-hidden">
            <div
              className="h-full bg-terracotta transition-all duration-500 ease-out rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        {completedCount > 0 && (
          <button
            type="button"
            onClick={resetAll}
            className="text-xs text-muted hover:text-terracotta underline"
          >
            Reset progresso
          </button>
        )}
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        <CatChip
          label="Tutte"
          count={CALENDARIO.length}
          active={activeCat === 'tutte'}
          onClick={() => setActiveCat('tutte')}
        />
        {CATEGORIE_GIORNO.map((c) => {
          const count = CALENDARIO.filter((g) => g.categoria === c).length;
          return (
            <CatChip
              key={c}
              label={c}
              count={count}
              active={activeCat === c}
              onClick={() => setActiveCat(c)}
              colors={CATEGORIA_COLORE[c]}
            />
          );
        })}
      </div>

      {/* Grid view: all 30 days as compact cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 mb-12">
        {visible.map((g) => (
          <GiornoCard
            key={g.giorno}
            giorno={g}
            isDone={done.has(g.giorno)}
            onToggle={() => toggleDone(g.giorno)}
          />
        ))}
      </div>

      {/* Detail sections: full content of each day, anchor-linked */}
      <div className="space-y-8">
        {visible.map((g) => (
          <DettaglioGiorno
            key={g.giorno}
            giorno={g}
            isDone={done.has(g.giorno)}
            onToggle={() => toggleDone(g.giorno)}
          />
        ))}
      </div>
    </div>
  );
}

function CatChip({
  label, count, active, onClick, colors,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  colors?: { bg: string; fg: string; ring: string };
}) {
  const activeCls = colors
    ? `${colors.bg} ${colors.fg} ring-2 ${colors.ring}`
    : 'bg-terracotta text-white';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
        active ? activeCls : 'bg-white border border-line text-muted hover:border-terracotta hover:text-terracotta'
      }`}
    >
      {label}
      <span className={`tabular-nums text-[10px] ${active ? 'opacity-80' : 'opacity-60'}`}>{count}</span>
    </button>
  );
}

function GiornoCard({
  giorno: g, isDone, onToggle,
}: { giorno: GiornoCalendario; isDone: boolean; onToggle: () => void }) {
  const colors = CATEGORIA_COLORE[g.categoria];
  return (
    <a
      href={`#giorno-${g.giorno}`}
      onClick={(e) => {
        // Allow link nav, but if user clicks the checkbox area, prevent jump
        if ((e.target as HTMLElement).closest('[data-checkbox]')) {
          e.preventDefault();
        }
      }}
      className={`relative block rounded-lg border bg-white p-3 hover:shadow-md hover:-translate-y-0.5 transition-all ${
        isDone ? 'border-[#6fa28b]/40 bg-[#6fa28b]/5' : 'border-line'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded ${colors.bg} ${colors.fg} font-bold text-xs tabular-nums`}>
          {String(g.giorno).padStart(2, '0')}
        </span>
        <button
          type="button"
          data-checkbox
          onClick={(e) => { e.preventDefault(); onToggle(); }}
          aria-label={isDone ? `Segna Giorno ${g.giorno} come da fare` : `Segna Giorno ${g.giorno} come fatto`}
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
            isDone ? 'bg-[#6fa28b] border-[#6fa28b] text-white' : 'border-line hover:border-terracotta'
          }`}
        >
          {isDone && <span className="text-[10px] leading-none">✓</span>}
        </button>
      </div>
      <div className={`text-xs font-bold leading-tight mb-1 line-clamp-2 ${isDone ? 'text-muted line-through' : 'text-ink'}`}>
        {g.titolo}
      </div>
      <div className="text-[10px] text-muted tabular-nums">{g.tempo} min</div>
    </a>
  );
}

function DettaglioGiorno({
  giorno: g, isDone, onToggle,
}: { giorno: GiornoCalendario; isDone: boolean; onToggle: () => void }) {
  const colors = CATEGORIA_COLORE[g.categoria];
  return (
    <section
      id={`giorno-${g.giorno}`}
      className={`scroll-mt-32 rounded-xl border bg-white p-5 sm:p-6 transition-colors ${
        isDone ? 'border-[#6fa28b]/40' : 'border-line'
      }`}
    >
      <div className="flex flex-wrap items-start gap-3 mb-3">
        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-md ${colors.bg} ${colors.fg} font-bold text-base tabular-nums shrink-0`}>
          {String(g.giorno).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 items-baseline mb-1">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold ${colors.bg} ${colors.fg}`}>
              {g.categoria}
            </span>
            <span className="text-xs text-muted tabular-nums">{g.tempo} min</span>
          </div>
          <h3 className={`font-serif text-xl font-bold leading-tight m-0 ${isDone ? 'text-muted line-through' : 'text-ink'}`}>
            {g.titolo}
          </h3>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label={isDone ? 'Segna come da fare' : 'Segna come fatto'}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${
            isDone
              ? 'bg-[#6fa28b] border-[#6fa28b] text-white'
              : 'bg-white border-line text-muted hover:border-terracotta hover:text-terracotta'
          }`}
        >
          {isDone ? '✓ Fatto' : 'Segna fatto'}
        </button>
      </div>

      <div className="grid sm:grid-cols-[1fr_auto] gap-5 sm:gap-8">
        <div className="space-y-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">
              Cosa fare
            </div>
            <p className="text-sm text-body leading-relaxed m-0">{g.cosa}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">
              Perché conta
            </div>
            <p className="text-sm text-muted leading-relaxed m-0 italic">{g.perche}</p>
          </div>
        </div>

        {g.link && (
          <div className="sm:max-w-[200px] sm:border-l sm:border-line sm:pl-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-line/60">
            <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2">
              Approfondisci nel corso
            </div>
            <Link
              href={g.link.href}
              className="inline-flex items-center gap-1.5 text-sm text-terracotta font-semibold hover:underline"
            >
              {g.link.label} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
