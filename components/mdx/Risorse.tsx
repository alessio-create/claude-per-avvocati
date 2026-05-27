/**
  * Risorse, links to official Anthropic resources or external materials at the end of a lesson.
  * Visual end-cap that's clearly differentiated from the lesson body.
  */
interface Risorsa {
  titolo: string;
  url: string;
  fonte: string; // e.g., "Anthropic Academy", "Anthropic Blog", "Studio Legale Rossi"
  durata?: string; // e.g., "1 hr video", "15 min read"
}

export function Risorse({ items }: { items: Risorsa[] }) {
  return (
    <div className="my-10 rounded-lg border border-line bg-gradient-to-br from-cream-panel to-cream p-6">
      <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-4">
        Risorse esterne per approfondire
      </div>
      <ul className="m-0 p-0 list-none space-y-3">
        {items.map((r, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="mt-1 text-terracotta font-bold shrink-0">→</span>
            <div className="flex-1">
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif font-bold text-ink hover:text-terracotta no-underline"
              >
                {r.titolo}
              </a>
              <div className="text-xs text-muted mt-0.5">
                {r.fonte}
                {r.durata && <> · {r.durata}</>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
