import { ClaudeMascot } from '../illustration/ClaudeMascot';

const starfield: React.CSSProperties = {
  backgroundColor: '#0a0807',
  backgroundImage: [
    'radial-gradient(1px 1px at 12% 18%, #fff 50%, transparent)',
    'radial-gradient(1px 1px at 28% 64%, #fff 50%, transparent)',
    'radial-gradient(1px 1px at 44% 22%, #fff 50%, transparent)',
    'radial-gradient(1px 1px at 58% 78%, #fff 50%, transparent)',
    'radial-gradient(1px 1px at 72% 36%, #fff 50%, transparent)',
    'radial-gradient(1px 1px at 86% 14%, #fff 50%, transparent)',
    'radial-gradient(1px 1px at 90% 70%, #ffd166 50%, transparent)',
    'radial-gradient(1px 1px at 8% 86%, #fff 50%, transparent)',
    'radial-gradient(1.5px 1.5px at 16% 44%, rgba(255,255,255,0.6) 50%, transparent)',
    'radial-gradient(1.5px 1.5px at 80% 22%, rgba(255,255,255,0.6) 50%, transparent)',
  ].join(','),
};

export function ChiSiamoProblema() {
  return (
    <section className="py-20 px-8 bg-cream-panel">
      <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_1.3fr] gap-14 items-center">
        <div className="relative rounded-xl aspect-square shadow-2xl overflow-hidden" style={starfield}>
          <span className="absolute top-4 left-4 text-[8px] text-terracotta-soft uppercase tracking-widest font-bold font-mono z-10">[ Claude in orbita ]</span>
          <div className="absolute top-1/2 left-1/2 w-36 h-36 -translate-x-1/2 -translate-y-1/2 anim-float">
            <ClaudeMascot variant="astro" size={144} />
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-2">Il problema · Perché serve un corso fatto bene</div>
          <h2 className="font-serif text-3xl font-bold leading-tight mb-5">Hai aperto Claude. Hai provato. Hai chiuso. Sai perché.</h2>
          <p className="text-sm leading-loose mb-3.5 text-body">Lunedì sera, le 19:40. Hai un parere da consegnare domani, 47 mail non lette, e una sentenza di Cassazione da leggere. Apri Claude, scrivi due righe, ottieni un testo generico che non puoi mandare al cliente. Chiudi.</p>
          <p className="text-sm leading-loose mb-3.5 text-body">Il problema non sei tu. Nessuno te lo spiega in italiano, nessuno parte dal tuo fascicolo, nessuno ti dice se ti serve Free, Pro, Max o Team prima di farti spendere 200 euro a vuoto.</p>
          <p className="text-sm leading-loose mb-3.5 text-body"><strong className="text-ink">Claude per Avvocati è il corso che mancava.</strong> Da anni lavoro a fianco di studi legali italiani. Uso Claude ogni giorno per pareri, contratti, ricerca giurisprudenziale, comparazione di clausole, riassunti di fascicoli da 400 pagine.</p>
          <p className="text-sm leading-loose mb-3.5 text-body">Ho testato ogni funzione e ho codificato i workflow che reggono in studio. <strong className="text-ink">Il corso è la scorciatoia: 44 lezioni, sei mesi di lavoro miei, dieci giorni di studio tuoi.</strong></p>
          <p className="text-sm leading-loose text-body">Non è teoria. È quello che Claude fa oggi in uno studio italiano: clienti italiani, segreto professionale, GDPR e deontologia inclusi.</p>
        </div>
      </div>
    </section>
  );
}
