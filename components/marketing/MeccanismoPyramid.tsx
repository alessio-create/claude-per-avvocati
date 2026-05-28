import { ClaudeStar } from '../illustration/ClaudeStar';

const tiers = [
  { lab: 'LV 1', name: 'Libero dal grezzo', w: 'w-full' },
  { lab: 'LV 2', name: 'Libero dalla burocrazia', w: 'w-[86%]' },
  { lab: 'LV 3', name: 'Libero dal sovraccarico', w: 'w-[70%]' },
  { lab: 'LV 4', name: 'Libero di pensare', w: 'w-[54%]' },
  { lab: 'LV 5', name: 'Pioniere', w: 'w-[38%]', highlight: true },
];

export function MeccanismoPyramid() {
  return (
    <div className="grid md:grid-cols-2 gap-14 items-center max-w-5xl mx-auto mb-14">
      <div className="bg-white border border-line rounded-xl aspect-square p-6 relative shadow-md">
        <div className="absolute top-4 right-4 opacity-40"><ClaudeStar size={24} /></div>
        <div className="flex flex-col items-center justify-center h-full gap-1.5">
          {[...tiers].reverse().map(t => (
            <div key={t.lab} className={`${t.w} text-center py-2 px-2.5 rounded text-[9px] font-semibold ${t.highlight ? 'bg-terracotta text-white' : 'bg-ink text-cream'}`}>
              <span className={`block text-[7px] uppercase tracking-widest mb-0.5 ${t.highlight ? 'text-white/70' : 'text-terracotta-soft'}`}>{t.lab}</span>
              {t.name}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold">Come è strutturato il corso · 01</div>
        <h2 className="font-serif text-2xl font-bold mt-2 mb-3 leading-tight">Cinque livelli, nell'ordine in cui ha senso impararli.</h2>
        <p className="text-sm leading-relaxed text-body mb-3">Il corso segue la stessa progressione che farebbe un collega più avanti di te: prima togli il lavoro grezzo, poi liberi spazio per pensare. <strong className="text-ink">Un livello alla volta</strong>, senza saltare i passaggi.</p>
        <div className="mt-3.5 pt-3.5 border-t border-[#d4cdbf] space-y-2">
          {[
            ['LV 1–2', 'Smetti di scrivere a mano bozze e atti ripetitivi'],
            ['LV 3', 'Gestisci più pratiche senza perdere il filo'],
            ['LV 4', 'Recuperi le ore per ragionare sul caso'],
            ['LV 5', 'Apri strade che gli altri studi non vedono ancora'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2.5 text-[11px] text-body"><span className="text-terracotta font-bold">→</span><span><strong>{k}</strong> · {v}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}
