'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  GLOSSARIO,
  GLOSSARIO_CATEGORIE,
  type GlossarioCategoria,
  type VoceGlossario,
} from '../../lib/glossario';

const CAT_COLOR: Record<GlossarioCategoria, string> = {
  'Tecnologia e prodotto': 'bg-[#e8defe] text-[#5e51a0]',
  'Diritto e compliance': 'bg-[#d8e6dc] text-[#4f7a5f]',
  'Pratica avvocatizia': 'bg-[#fde2cc] text-[#b86b3f]',
  'Concetti del corso': 'bg-[#d4ecdf] text-[#3c8a66]',
};

export function Glossario() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<GlossarioCategoria | 'tutte'>('tutte');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARIO.filter((v) => {
      if (activeCat !== 'tutte' && v.categoria !== activeCat) return false;
      if (!q) return true;
      const haystacks = [
        v.termine.toLowerCase(),
        v.definizione.toLowerCase(),
        ...(v.aliases ?? []).map((a) => a.toLowerCase()),
      ];
      return haystacks.some((h) => h.includes(q));
    });
  }, [query, activeCat]);

  // Group filtered results by category for display
  const grouped = useMemo(() => {
    const out = new Map<GlossarioCategoria, VoceGlossario[]>();
    for (const v of filtered) {
      const list = out.get(v.categoria) ?? [];
      list.push(v);
      out.set(v.categoria, list);
    }
    return out;
  }, [filtered]);

  return (
    <div>
      {/* Controls — sits flush under the progress bar (top-8 = 32px = bar height).
          Solid cream background (no transparency) + a slight inset margin so
          there's no gap where page content scrolls through. */}
      <div className="mb-8 sticky top-8 z-10 bg-cream py-3 -mx-4 px-4">
        <div className="relative mb-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca un termine, una sigla, una norma…"
            className="w-full border border-line rounded-lg pl-10 pr-9 py-2.5 text-sm bg-white focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/15"
          />
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md text-muted hover:text-ink hover:bg-cream-panel flex items-center justify-center"
              aria-label="Cancella ricerca"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <CatChip label="Tutte" count={GLOSSARIO.length} active={activeCat === 'tutte'} onClick={() => setActiveCat('tutte')} />
          {GLOSSARIO_CATEGORIE.map((c) => {
            const count = GLOSSARIO.filter((v) => v.categoria === c).length;
            return (
              <CatChip key={c} label={c} count={count} active={activeCat === c} onClick={() => setActiveCat(c)} />
            );
          })}
        </div>
      </div>

      {/* Result count */}
      <div className="text-xs text-muted mb-5 tabular-nums">
        {filtered.length} {filtered.length === 1 ? 'termine' : 'termini'}
        {query && ` per "${query}"`}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-line bg-cream-panel p-10 text-center">
          <p className="text-muted text-sm">
            Nessun termine trovato. Prova con un altro termine o cambia categoria.
          </p>
        </div>
      )}

      {/* Term groups by category */}
      <div className="space-y-12">
        {GLOSSARIO_CATEGORIE.map((cat) => {
          const items = grouped.get(cat);
          if (!items || items.length === 0) return null;
          return (
            <section key={cat}>
              <h2 className="font-serif text-xl font-bold text-ink mb-5 pb-2 border-b border-line">
                {cat} <span className="text-muted/60 font-normal text-sm tabular-nums">· {items.length}</span>
              </h2>
              <div className="space-y-6">
                {items.map((v) => <VoceCard key={v.slug} voce={v} />)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function CatChip({
  label, count, active, onClick,
}: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
        active
          ? 'bg-terracotta text-white'
          : 'bg-white border border-line text-muted hover:border-terracotta hover:text-terracotta'
      }`}
    >
      {label}
      <span className={`tabular-nums text-[10px] ${active ? 'opacity-80' : 'opacity-60'}`}>{count}</span>
    </button>
  );
}

function VoceCard({ voce }: { voce: VoceGlossario }) {
  return (
    <article id={voce.slug} className="scroll-mt-32 rounded-lg border border-line bg-white p-5 hover:border-terracotta/40 transition-colors">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
        <h3 className="font-serif text-lg font-bold text-ink m-0">{voce.termine}</h3>
        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${CAT_COLOR[voce.categoria]}`}>
          {voce.categoria}
        </span>
      </div>
      <p className="text-sm text-body leading-relaxed mb-3 m-0">
        {voce.definizione}
      </p>
      {voce.vediAnche && voce.vediAnche.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
          <span className="uppercase tracking-widest font-semibold text-muted/70 mr-1">Vedi anche</span>
          {voce.vediAnche.map((ref, i) => {
            const isInternal = ref.href.startsWith('#');
            return (
              <span key={i} className="inline-flex items-baseline gap-1.5">
                {i > 0 && <span className="text-line">·</span>}
                {isInternal ? (
                  <a href={ref.href} className="text-terracotta hover:underline font-semibold">
                    {ref.label}
                  </a>
                ) : (
                  <Link href={ref.href} className="text-terracotta hover:underline font-semibold">
                    {ref.label}
                  </Link>
                )}
              </span>
            );
          })}
        </div>
      )}
    </article>
  );
}
