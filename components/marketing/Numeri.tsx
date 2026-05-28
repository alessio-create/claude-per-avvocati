interface Stat {
  num: React.ReactNode;
  label: string;
}

const stats: Stat[] = [
  { num: <>8 <span className="text-terracotta-soft mx-0.5">→</span> 1</>, label: 'strumenti sostituiti da Claude' },
  { num: '12h', label: 'risparmiate a settimana in studio' },
  { num: '400pp', label: 'di fascicolo riassunte in 6 minuti' },
  { num: '44', label: 'lezioni, 10 moduli, 4 bonus' },
  { num: '10gg', label: 'per finire il corso da zero' },
  { num: '€97', label: 'una volta, accesso a vita' },
  { num: '14gg', label: 'rimborso senza domande' },
  { num: '40+', label: 'studi italiani su cui ho testato' },
];

export function Numeri() {
  // duplicate the list so the marquee can loop seamlessly
  const items = [...stats, ...stats];
  return (
    <section className="border-y border-[#1f1a16] bg-[#0a0807] text-cream py-6 overflow-hidden">
      <div className="text-center text-[10px] text-terracotta-soft uppercase tracking-widest font-bold mb-3">
        L&apos;impatto in numeri · misurato su 40+ studi italiani
      </div>
      <div
        className="overflow-hidden"
        style={{
          maskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
        }}
      >
        <div className="flex gap-12 items-center whitespace-nowrap anim-marquee w-max">
          {items.map((s, i) => (
            <div key={i} className="flex items-baseline gap-2">
              <span className="font-serif text-3xl md:text-4xl font-bold text-terracotta tabular-nums tracking-tight leading-none">
                {s.num}
              </span>
              <span className="text-[11px] text-muted uppercase tracking-wider font-semibold">
                {s.label}
              </span>
              <span className="text-terracotta-soft mx-2 opacity-40">·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
