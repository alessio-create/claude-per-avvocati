/**
  * Pillari, value pillars framework (3-5 named pillars with descriptions).
  * Inspired by Anthropic's "AI Fluency: Framework & Foundations" course structure.
  */
interface PillarItem {
  numero: string;
  titolo: string;
  descrizione: string;
}

export function Pillari({ items }: { items: PillarItem[] }) {
  return (
    <div className="my-8 grid gap-3 md:grid-cols-2">
      {items.map((p) => (
        <div key={p.numero} className="relative rounded-lg border border-line bg-cream-panel p-5 pl-14">
          <div className="absolute left-4 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-terracotta font-serif text-xs font-bold text-white">
            {p.numero}
          </div>
          <h4 className="font-serif text-base font-bold text-ink mb-1.5 leading-tight">{p.titolo}</h4>
          <p className="text-sm text-body leading-relaxed m-0">{p.descrizione}</p>
        </div>
      ))}
    </div>
  );
}
