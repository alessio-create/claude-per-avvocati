export function FinalCTA() {
  return (
    <section className="py-20 px-8 text-center max-w-md mx-auto">
      <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold">Decidi adesso</div>
      <h2 className="font-serif text-3xl font-bold leading-tight mt-2 mb-4">
        Tra un anno vorrai aver iniziato oggi.
      </h2>
      <p className="text-sm text-muted mb-5">
        Sei moduli core + quattro bonus. Certificato finale. Il Modulo 1 è gratis, niente carta, inizia adesso.
      </p>
      <div className="flex gap-3 justify-center items-center flex-wrap">
        <a
          href="/iscriviti-gratis"
          className="bg-terracotta text-white px-7 py-3.5 rounded font-bold text-sm shadow-xl anim-glow"
        >
          Inizia gratis →
        </a>
        <a
          href="#prezzi"
          className="border border-line bg-white text-ink px-5 py-3.5 rounded font-semibold text-sm hover:border-terracotta hover:text-terracotta transition-colors"
        >
          Piani da €79
        </a>
      </div>
    </section>
  );
}
