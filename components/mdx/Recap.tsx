import { Children, isValidElement, type ReactNode } from 'react';

/**
 * Recap + Punto: pedagogical bookend that closes a lesson or module.
 *
 * Retrieval practice + spaced rehearsal are among the highest-evidence
 * techniques in learning science. The Recap forces the learner to revisit
 * the 3-5 key takeaways before moving on, dramatically improving retention
 * vs. just reading and moving forward.
 *
 * Usage in MDX:
 *
 *   <Recap>
 *     <Punto>Claude è un collega, non un motore di ricerca</Punto>
 *     <Punto>Ogni prompt va costruito con Ruolo + Task + Vincoli</Punto>
 *     <Punto>Il contesto è la singola leva più forte sull'output</Punto>
 *   </Recap>
 */

export function Punto({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

export function Recap({
  titolo = 'Tre cose da ricordare',
  children,
}: { titolo?: string; children: ReactNode }) {
  const items = Children.toArray(children).filter(isValidElement);
  return (
    <section className="my-10 rounded-xl border border-line bg-ink text-cream p-6 sm:p-7 shadow-xl relative overflow-hidden">
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
        aria-hidden
        style={{ background: 'radial-gradient(circle, rgba(217,119,87,0.25), transparent 60%)' }}
      />
      <div className="relative">
        <div className="text-[10px] uppercase tracking-widest text-terracotta-soft font-bold mb-1">
          Recap
        </div>
        <h3 className="font-serif text-xl font-bold text-cream mt-0 mb-5">{titolo}</h3>
        <ol className="space-y-3 m-0 p-0 list-none">
          {items.map((child, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="shrink-0 mt-0.5 w-7 h-7 rounded-md border border-terracotta text-terracotta flex items-center justify-center text-xs font-bold tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 text-cream text-sm sm:text-base leading-snug">
                {(child as { props: { children: ReactNode } }).props.children}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
