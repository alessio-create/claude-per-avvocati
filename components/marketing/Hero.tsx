import { ClaudeMascot } from '../illustration/ClaudeMascot';
import { HeroCTAs } from './HeroCTAs';

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
        Lo studio legale,
        <span className="hidden sm:inline"><br /></span>
        <span className="sm:hidden"> </span>
        con <span className="text-terracotta italic">Claude</span> dentro.
      </h1>

      <p className="text-terracotta font-semibold text-xs sm:text-sm uppercase tracking-widest mb-4 anim-rise anim-d-2">
        Claude per Avvocati, il corso pratico in 44 lezioni.
      </p>

      <p className="text-sm sm:text-base text-body leading-relaxed mb-6 max-w-xl mx-auto anim-rise anim-d-3">
        Con Claude risparmi tempo speso in attività manuali ripetitive mantenendo la qualità, tutto dentro i confini del GDPR e della deontologia forense.
      </p>

      <div className="anim-rise anim-d-4">
        <HeroCTAs glow />
      </div>
    </section>
  );
}
