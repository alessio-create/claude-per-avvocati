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
      <div className="flex gap-3 justify-center items-center flex-wrap">
        <a
          href="/iscriviti-gratis"
          className="bg-terracotta text-white px-7 py-3.5 rounded font-bold text-sm shadow-xl anim-glow"
        >
          Inizia il Modulo 1 →
        </a>
        <a
          href="#prezzi"
          className="border border-line bg-white text-ink px-5 py-3.5 rounded font-semibold text-sm hover:border-terracotta hover:text-terracotta transition-colors"
        >
          Scopri i piani
        </a>
      </div>
      <p className="text-xs text-muted mt-4">
        Nessuna carta per il Modulo 1. Sui piani a pagamento, 14 giorni di rimborso senza domande.
      </p>
    </section>
  );
}
