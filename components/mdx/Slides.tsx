'use client';
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

/**
 * Slides + Slide: an inline lesson slide deck.
 *
 * Wrap a sequence of <Slide title="..."> blocks inside <Slides> in any MDX
 * lesson. Renders as a single-card viewer with prev/next controls, dot
 * indicators, keyboard arrow navigation, and a progress bar. Designed to
 * compress dense lesson concepts into bite-size frames the learner can
 * tap through, while keeping the full prose available above/below.
 *
 * Usage in MDX:
 *
 *   <Slides>
 *     <Slide title="Cosa imparerai">
 *       Tre regole per scrivere un prompt che funziona.
 *     </Slide>
 *     <Slide title="Regola 1">
 *       Ruolo + Task + Vincoli, in quest'ordine.
 *     </Slide>
 *   </Slides>
 */

export function Slide({
  title,
  children,
}: { title?: string; children: ReactNode }) {
  // The actual rendering happens inside <Slides> which reads `title` from
  // props. We return the children wrapped so Slides can read them uniformly.
  return <div data-slide-title={title}>{children}</div>;
}

interface SlideProps {
  title?: string;
  children: ReactNode;
}

export function Slides({ children }: { children: ReactNode }) {
  // Collect valid <Slide> children + their props (title)
  const slides = Children.toArray(children).filter(isValidElement) as ReactElement<SlideProps>[];
  const total = slides.length;
  const [i, setI] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => {
      setI((curr) => Math.max(0, Math.min(total - 1, next)));
    },
    [total],
  );

  // Keyboard navigation (only while the deck is focused or hovered)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!rootRef.current) return;
      const active = document.activeElement;
      const inDeck =
        rootRef.current === active ||
        rootRef.current.contains(active) ||
        rootRef.current.matches(':hover');
      if (!inDeck) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(i - 1); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i, go]);

  if (total === 0) return null;
  const current = slides[i];
  const title = current?.props?.title;

  return (
    <section
      ref={rootRef}
      tabIndex={0}
      aria-label="Slide deck della lezione"
      className="my-10 rounded-xl border border-line bg-white shadow-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-terracotta/40"
    >
      {/* Top bar: deck label + counter */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-line bg-cream-panel">
        <span className="text-[10px] uppercase tracking-widest text-terracotta font-bold">
          Slide deck
        </span>
        <span className="text-[11px] text-muted tabular-nums">
          {i + 1} <span className="text-line">/</span> {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-cream-panel">
        <div
          className="h-full bg-terracotta transition-all duration-300 ease-out"
          style={{ width: `${((i + 1) / total) * 100}%` }}
        />
      </div>

      {/* Slide content area */}
      <div className="min-h-[260px] px-6 sm:px-10 py-8 sm:py-10">
        {title && (
          <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight mb-4 text-ink">
            {title}
          </h3>
        )}
        <div className="text-body leading-relaxed text-base sm:text-lg max-w-prose">
          {/* Render the current Slide's children directly */}
          {cloneElement(current, { key: i })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-t border-line bg-cream-panel px-4 py-3">
        <button
          type="button"
          onClick={() => go(i - 1)}
          disabled={i === 0}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-line text-ink hover:border-terracotta hover:text-terracotta disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-line disabled:hover:text-ink transition-colors"
          aria-label="Slide precedente"
        >
          <span aria-hidden>←</span> Precedente
        </button>

        <div className="flex gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => go(idx)}
              aria-label={`Vai alla slide ${idx + 1}`}
              aria-current={idx === i}
              className={`h-2 rounded-full transition-all ${
                idx === i ? 'bg-terracotta w-5' : 'bg-line w-2 hover:bg-muted'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(i + 1)}
          disabled={i === total - 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-terracotta text-white hover:bg-terracotta/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Slide successiva"
        >
          Avanti <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}
