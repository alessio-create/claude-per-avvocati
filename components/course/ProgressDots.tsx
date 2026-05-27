import type { CorsoIndex } from '../../lib/content';

export function ProgressDots({
  index, currentModulo, currentLezione,
}: { index: CorsoIndex; currentModulo: string; currentLezione: string }) {
  const flat: { modulo: string; lezione: string }[] = [];
  for (const m of index.moduli) for (const l of m.lezioni) flat.push({ modulo: m.slug, lezione: l.slug });
  const i = flat.findIndex(x => x.modulo === currentModulo && x.lezione === currentLezione);

  return (
    <div className="flex gap-1 mb-3">
      {flat.map((_, idx) => (
        <span key={idx} className={`h-[3px] w-3.5 rounded-sm ${idx < i ? 'bg-terracotta' : idx === i ? 'bg-terracotta opacity-50' : 'bg-line'}`} />
      ))}
    </div>
  );
}
