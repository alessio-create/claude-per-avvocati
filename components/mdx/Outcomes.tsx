import { Children, isValidElement, type ReactNode } from 'react';

/**
 * Outcomes + Outcome: pedagogical bookend that opens a lesson or module.
 *
 * Renders the explicit learning outcomes ("at the end of this module, you'll
 * be able to..."). Setting concrete outcomes upfront is one of the most
 * established principles in adult learning design — it primes attention and
 * lets the learner self-assess later.
 *
 * Usage in MDX:
 *
 *   <Outcomes titolo="Alla fine del modulo, sai:">
 *     <Outcome>Scrivere un prompt che produce una bozza di parere usabile</Outcome>
 *     <Outcome>Distinguere quando usare Chat vs Projects</Outcome>
 *     <Outcome>Configurare Custom Instructions per il tuo studio</Outcome>
 *   </Outcomes>
 */

export function Outcome({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

export function Outcomes({
  titolo = 'Alla fine, saprai:',
  children,
}: { titolo?: string; children: ReactNode }) {
  const items = Children.toArray(children).filter(isValidElement);
  return (
    <section className="my-8 rounded-xl border-2 border-terracotta/40 bg-gradient-to-br from-[#fef5ee] to-cream-panel p-6">
      <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-2">
        Cosa imparerai
      </div>
      <h3 className="font-serif text-xl font-bold text-ink mt-0 mb-4">
        {titolo}
      </h3>
      <ul className="space-y-2.5 m-0 p-0 list-none">
        {items.map((child, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-terracotta text-white flex items-center justify-center text-xs font-bold tabular-nums">
              {i + 1}
            </span>
            <span className="flex-1 text-body text-sm sm:text-base leading-snug">
              {/* Pull just the inner children of the <Outcome> wrapper */}
              {(child as { props: { children: ReactNode } }).props.children}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
