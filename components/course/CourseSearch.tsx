'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CorsoIndex } from '../../lib/content';

interface Match {
  href: string;
  moduloTitolo: string;
  moduloOrdine: number;
  lezioneTitolo: string;
  lezioneSottotitolo: string;
  tipo: 'lezione' | 'esame';
}

/**
 * Compact lesson search. Lives in the sticky progress bar at the top of the
 * course. Input expands on focus. Typing shows up to 6 matching lessons in
 * a floating dropdown — title + subtitle + which module. Esc/blur closes.
 */
export function CourseSearch({ index }: { index: CorsoIndex }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const all: Match[] = useMemo(() => {
    const out: Match[] = [];
    for (const m of index.moduli) {
      for (const l of m.lezioni) {
        out.push({
          href: `/corso/${m.slug}/${l.slug}`,
          moduloTitolo: m.titolo,
          moduloOrdine: m.ordine,
          lezioneTitolo: l.titolo,
          lezioneSottotitolo: l.sottotitolo,
          tipo: l.tipo === 'esame' ? 'esame' : 'lezione',
        });
      }
    }
    return out;
  }, [index]);

  const matches: Match[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const hits = all.filter((m) => {
      const hay = `${m.lezioneTitolo} ${m.lezioneSottotitolo} ${m.moduloTitolo}`.toLowerCase();
      return hay.includes(q);
    });
    return hits.slice(0, 6);
  }, [query, all]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // Reset highlight when results change
  useEffect(() => { setHighlight(0); }, [matches.length, query]);

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (matches.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (h + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h - 1 + matches.length) % matches.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = matches[highlight];
      if (target) {
        router.push(target.href);
        setOpen(false);
        setQuery('');
      }
    }
  }

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex items-center gap-1.5 bg-white border rounded-full transition-[border-color,box-shadow] duration-200 ease-out w-full
          ${open ? 'border-terracotta shadow-sm' : 'border-line hover:border-terracotta/60'}
        `}
      >
        <span className="pl-2.5 text-muted text-[12px] leading-none" aria-hidden>⌕</span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Cerca lezione…"
          aria-label="Cerca nel corso"
          className="flex-1 bg-transparent border-0 outline-none text-[11px] py-1 pr-2.5 placeholder:text-muted/70 placeholder:font-medium tabular-nums min-w-0"
        />
      </div>

      {showDropdown && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] min-w-[260px] w-max max-w-[320px] bg-white border border-line rounded-lg shadow-xl overflow-hidden z-40"
        >
          {matches.length === 0 ? (
            <div className="px-3 py-3 text-[12px] text-muted text-center">
              Nessuna lezione trovata per “{query}”.
            </div>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto py-1">
              {matches.map((m, i) => (
                <li key={m.href}>
                  <Link
                    href={m.href}
                    role="option"
                    aria-selected={i === highlight}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => { setOpen(false); setQuery(''); }}
                    className={`block px-3 py-2 border-l-2 transition-colors ${
                      i === highlight ? 'bg-cream-panel border-terracotta' : 'border-transparent hover:bg-cream-panel/60'
                    }`}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-[9px] uppercase tracking-widest text-terracotta font-bold shrink-0">
                        M{String(m.moduloOrdine).padStart(2, '0')}{m.tipo === 'esame' ? ' · esame' : ''}
                      </span>
                      <span className="text-[12px] font-semibold text-ink leading-tight truncate">{m.lezioneTitolo}</span>
                    </div>
                    <div className="text-[10.5px] text-muted leading-snug mt-0.5 truncate">{m.lezioneSottotitolo}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
