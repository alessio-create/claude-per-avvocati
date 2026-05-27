/**
  * BarChart, simple horizontal SVG bar chart for time/cost comparisons.
  * Values are normalized against the maximum value automatically.
  * Designed for "before/after" or "vs" comparisons inside a lesson.
  */
interface Bar {
  label: string;
  value: number;
  display?: string; // optional override for what's shown (e.g., "4-6 ore" instead of 240)
  highlight?: boolean; // makes this bar terracotta vs muted
}

export function BarChart({
  titolo,
  unita,
  fonte,
  bars,
}: {
  titolo: string;
  unita?: string;
  fonte?: string;
  bars: Bar[];
}) {
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <figure className="my-8 rounded-lg border border-line bg-white p-6 shadow-sm">
      <figcaption className="font-serif text-base font-bold text-ink mb-1">{titolo}</figcaption>
      {unita && <div className="text-xs text-muted mb-5">Unità: {unita}</div>}
      <div className="space-y-3">
        {bars.map((b, i) => {
          const pct = Math.max(2, (b.value / max) * 100);
          return (
            <div key={i} className="grid grid-cols-[180px_1fr_auto] gap-3 items-center text-sm">
              <span className="text-body text-right truncate">{b.label}</span>
              <div className="relative h-6 bg-cream-panel rounded">
                <div
                  className={`h-full rounded transition-all ${b.highlight ? 'bg-terracotta' : 'bg-terracotta-soft'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`font-bold text-sm tabular-nums ${b.highlight ? 'text-terracotta' : 'text-body'}`}>
                {b.display ?? b.value}
              </span>
            </div>
          );
        })}
      </div>
      {fonte && <div className="text-[10px] text-muted mt-5 italic">Fonte: {fonte}</div>}
    </figure>
  );
}
