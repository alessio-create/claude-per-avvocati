const tickers = [
  { sans: true, label: 'ANTHROPIC' },
  { italic: true, label: 'Il Sole 24 Ore' },
  { label: 'Altalex' },
  { sans: true, label: 'DIRITTO.IT' },
  { italic: true, label: 'Maggioli' },
  { label: 'Filodiritto' },
  { sans: true, label: 'CLAUDE.AI' },
];

export function TrustStrip() {
  const items = [...tickers, ...tickers];
  return (
    <section className="border-y border-line bg-cream py-5 overflow-hidden anim-rise anim-d-6">
      <div className="text-center text-[10px] text-muted uppercase tracking-widest font-semibold mb-3 anim-rise anim-d-6">
        Featured in · Strumenti · Partner editoriali
      </div>
      <div className="overflow-hidden anim-rise anim-d-7" style={{
        maskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
      }}>
        <div className="flex gap-14 items-center whitespace-nowrap anim-marquee w-max">
          {items.map((t, i) => (
            <span
              key={i}
              className={`opacity-70 ${t.sans ? 'font-extrabold uppercase tracking-wider text-xs' : 'font-serif text-base'} ${t.italic ? 'italic' : ''} text-body`}
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
