import { HeroCTAs } from './HeroCTAs';

export function FinalCTA() {
  return (
    <section className="py-20 px-8 text-center max-w-md mx-auto">
      <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold">Quaranta minuti</div>
      <h2 className="font-serif text-3xl font-bold leading-tight mt-2 mb-4">
        Il primo modulo dura 40 minuti. Iniziare ti costa solo il tempo.
      </h2>
      <p className="text-sm text-muted mb-5">
        Ogni settimana che rimandi sono ore perse su bozze, ricerche e mail che Claude può scrivere con te. Il Modulo 1 è gratis, senza carta: lo apri, lo guardi, decidi dopo.
      </p>
      <HeroCTAs glow />
    </section>
  );
}
