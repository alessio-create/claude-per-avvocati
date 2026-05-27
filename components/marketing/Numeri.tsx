interface Stat {
  num: React.ReactNode;
  label: string;
}

const stats: Stat[] = [
  { num: <>8 <span className="text-terracotta-soft mx-0.5">→</span> 1</>, label: 'strumenti consolidati' },
  { num: '12h', label: 'risparmiate a settimana' },
  { num: '€2.400', label: 'risparmio annuo' },
  { num: '68%', label: 'avvocati italiani entro fine 2026' },
  { num: '44', label: 'lezioni nel corso' },
  { num: '10', label: 'moduli totali' },
  { num: '4', label: 'moduli bonus' },
  { num: '14gg', label: 'rimborso senza domande' },
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
