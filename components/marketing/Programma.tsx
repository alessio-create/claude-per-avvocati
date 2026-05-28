import { ModuleIcon } from '../illustration/ModuleIcon';
import { getCorsoIndex, type CoverColor, type ModuleIconName } from '../../lib/content';

const coverBg: Record<CoverColor, string> = {
  lilac: 'bg-cover-lilac', sage: 'bg-cover-sage', peach: 'bg-cover-peach',
  lavender: 'bg-cover-lavender', terracotta: 'bg-cover-terracotta', mint: 'bg-cover-mint',
};
const iconColorForCover: Record<CoverColor, string> = {
  lilac: '#1a1714', sage: '#fff', peach: '#1a1714',
  lavender: '#fff', terracotta: '#fff', mint: '#1a1714',
};

export function Programma() {
  const idx = getCorsoIndex();
  const totalLezioni = idx.moduli.reduce((s, m) => s + m.lezioniPianificate, 0);
  return (
    <section id="programma" className="bg-[#0f0c0a] text-cream py-20 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-[10px] uppercase tracking-widest text-terracotta-soft font-bold">Il programma completo</div>
          <h2 className="text-cream font-serif text-3xl font-bold mt-2 mb-3">{idx.moduli.length} moduli, {totalLezioni} lezioni. Niente di più, niente di meno.</h2>
          <p className="text-muted text-sm max-w-md mx-auto">Ogni modulo è un mini-corso a sé, con un risultato concreto da portare a casa. Insieme, la mappa per far lavorare Claude nel tuo studio.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-3.5">
          {idx.moduli.map(m => {
            const authored = m.lezioni.length;
            const planned = m.lezioniPianificate;
            const inArrivo = authored < planned;
            return (
              <div key={m.slug} className="bg-ink border border-[#2e2922] rounded-xl overflow-hidden hover:-translate-y-1 hover:border-terracotta transition-all cursor-pointer relative">
                {inArrivo && (
                  <span className="absolute top-3 right-3 z-10 text-[8px] uppercase tracking-widest font-bold bg-terracotta/90 text-white px-2 py-0.5 rounded">
                    In arrivo
                  </span>
                )}
                <div className={`h-32 flex items-center justify-center ${coverBg[m.coloreCover]}`}>
                  <ModuleIcon name={m.icona as ModuleIconName} size={56} color={iconColorForCover[m.coloreCover]} />
                </div>
                <div className="p-4.5 pt-4">
                  <h4 className="text-cream font-serif text-sm font-bold mb-2 leading-tight">{m.titolo}</h4>
                  <p className="text-[10px] text-muted/80 mb-2 leading-snug">{m.sottotitolo}</p>
                  <div className="text-[9.5px] text-muted mb-3.5 leading-snug">
                    {planned} lezioni
                    <span className="text-[#463d33] mx-1.5">·</span>
                    ~{m.durataMinutiPianificati} min
                  </div>
                  <div className="text-[9.5px] text-muted flex items-center gap-1.5 pt-3 border-t border-[#2e2922]">
                    <span className="text-terracotta">◇</span> {m.categoria}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
