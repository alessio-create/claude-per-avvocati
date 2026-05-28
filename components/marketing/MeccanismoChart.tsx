import { ClaudeStar } from '../illustration/ClaudeStar';
import { ClaudeMascot } from '../illustration/ClaudeMascot';

// Positions: each is { left%, top% } of the chart quadrant. All smile.
const points = [
  { left: '14%', top: '78%', variant: 'mid' as const },
  { left: '30%', top: '62%', variant: 'mid' as const },
  { left: '55%', top: '52%', variant: 'happy' as const },
  { left: '42%', top: '32%', variant: 'happy' as const },
];
const you = { left: '78%', top: '16%' };

export function MeccanismoChart() {
  return (
    <div className="grid md:grid-cols-2 gap-14 items-center max-w-5xl mx-auto">
      <div className="order-2 md:order-1">
        <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold">Dove ti porta il corso · 02</div>
        <h2 className="font-serif text-2xl font-bold mt-2 mb-3 leading-tight">Lo so che sei stanco dei corsi. Questo parte da un punto diverso.</h2>
        <p className="text-sm leading-relaxed text-body mb-3">La maggior parte dei contenuti su AI o parla di Claude in astratto, o parla di diritto senza toccare gli strumenti. Il quadrante in alto a destra è quasi vuoto: il corso è costruito per portarti lì, partendo dal tuo lavoro reale.</p>
        <div className="mt-3.5 pt-3.5 border-t border-[#d4cdbf] space-y-2">
          {[
            ['Avvocato medio', 'Sente parlare di AI, non la usa in studio'],
            ['Influencer AI', 'Spiega Claude, mai visto un fascicolo'],
            ['Tu dopo il corso', 'Conosci lo strumento e sai dove applicarlo'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2.5 text-[11px] text-body"><span className="text-terracotta font-bold">→</span><span><strong>{k}</strong> · {v}</span></div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-line rounded-xl aspect-square p-6 relative shadow-md order-1 md:order-2">
        <div className="absolute top-4 right-4 opacity-40"><ClaudeStar size={24} /></div>
        <div className="h-full relative px-5 pt-6 pb-7">
          <div className="absolute top-7 left-6 right-6 bottom-8 border-l border-b border-line">
            {/* dotted path connecting smiles → you */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 14 78 L 30 62 L 55 52 L 42 32 L 78 16"
                fill="none"
                stroke="#d97757"
                strokeWidth="0.6"
                strokeDasharray="2 2"
                opacity="0.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {points.map((p, i) => (
              <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 anim-bob" style={{ left: p.left, top: p.top, animationDelay: `${i * 0.3}s` }}>
                <ClaudeMascot variant={p.variant} size={24} />
              </div>
            ))}
            <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 anim-bob z-10" style={{ left: you.left, top: you.top, filter: 'drop-shadow(0 0 8px rgba(217,119,87,0.55))' }}>
              <ClaudeMascot variant="astro" size={32} />
              <span className="absolute left-9 top-1 text-[9px] text-terracotta font-bold font-serif italic whitespace-nowrap">Tu</span>
            </div>
          </div>
          <div className="absolute left-1.5 top-1/2 -rotate-90 origin-center text-[7px] uppercase tracking-widest text-muted font-semibold">Applicazione legale →</div>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[7px] uppercase tracking-widest text-muted font-semibold">Conoscenza Claude →</div>
        </div>
      </div>
    </div>
  );
}
