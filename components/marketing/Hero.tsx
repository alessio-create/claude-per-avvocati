import { ClaudeMascot } from '../illustration/ClaudeMascot';

export function Hero() {
  return (
    <section className="relative py-12 md:py-16 px-5 sm:px-8 text-center max-w-3xl mx-auto">
      {/* Floating mascot: hidden on small screens (would overlap H1), kept on md+ */}
      <div className="hidden md:block absolute right-8 top-12 w-16 h-16 anim-float anim-rise anim-d-5">
        <ClaudeMascot variant="astro" size={64} />
      </div>

      <span className="inline-flex items-center gap-2 bg-white border border-line px-3 py-1.5 rounded-full text-[10px] text-body mb-5 font-medium shadow-sm anim-rise">
        <span className="inline-block w-2 h-2 rounded-full bg-terracotta anim-pulse-dot" />
        Iscrizioni aperte · Maggio 2026
      </span>

      <h1 className="text-4xl sm:text-5xl font-bold leading-[1.05] mb-5 anim-rise anim-d-1">
        <span className="text-terracotta italic">Claude</span>, al lavoro
        <span className="hidden sm:inline"><br /></span>
        <span className="sm:hidden"> </span>
        nel tuo studio.
      </h1>

      <p className="text-terracotta font-semibold text-xs sm:text-sm uppercase tracking-widest mb-4 anim-rise anim-d-2">
        Il corso che ti fa redigere atti, pareri e contratti in metà tempo.
      </p>

      <p className="text-sm sm:text-base text-body leading-relaxed mb-6 max-w-xl mx-auto anim-rise anim-d-3">
        Alla fine sai quando aprire Chat, quando un Project, quando Claude Code; sai costruire Skills riusabili per le tue materie, collegare Claude ai tuoi gestionali via MCP, e usare l&apos;API senza far uscire dati dallo studio. Tutto a norma GDPR e deontologia forense.
      </p>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-3 justify-center items-center flex-wrap w-full max-w-sm sm:max-w-none anim-rise anim-d-4">
          <a
            href="/iscriviti-gratis"
            className="flex-1 sm:flex-none text-center bg-terracotta text-white px-6 sm:px-7 py-3 rounded font-bold text-sm shadow-lg anim-glow"
          >
            Inizia gratis →
          </a>
          <a
            href="#prezzi"
            className="flex-1 sm:flex-none text-center border border-line bg-white text-ink px-5 py-3 rounded font-semibold text-sm hover:border-terracotta hover:text-terracotta transition-colors"
          >
            Vedi i piani
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 justify-center items-center text-[11px] text-muted anim-rise anim-d-5">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[#6fa28b] font-bold">✓</span>
            Modulo 1 gratis, senza carta
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[#6fa28b] font-bold">✓</span>
            Rimborso a 14 giorni
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[#6fa28b] font-bold">✓</span>
            Fattura allo studio
          </span>
        </div>
      </div>
    </section>
  );
}
