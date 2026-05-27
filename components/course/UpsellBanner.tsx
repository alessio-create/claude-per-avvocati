'use client';
import Link from 'next/link';
import { useTier } from '../../lib/use-tier';
import { isPaid } from '../../lib/access';

/**
 * Persistent upgrade panel rendered on the corso index for free / anonymous
 * users. Frames the offer as "buy the whole course + certification" — same
 * €79 unlocks Moduli 2–6 and the cert. Hidden entirely for paid tiers.
 */
export function UpsellBanner() {
  const me = useTier();
  if (me === null) return null;
  if (isPaid(me.tier)) return null;

  return (
    <section className="mb-10 rounded-xl border-2 border-terracotta bg-gradient-to-br from-white via-cream-panel to-[#fff4ec] p-6 shadow-md relative overflow-hidden">
      <span className="absolute -top-3 left-5 bg-terracotta text-white px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold shadow">
        Sei sul piano gratis
      </span>
      <div className="flex items-start gap-5 flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight mb-2">
            Sblocca il corso completo e la certificazione
          </h2>
          <p className="text-sm text-body leading-snug mb-3 m-0">
            Con €79 una tantum apri tutto: <strong>Moduli 2–6</strong>, <strong>certificato finale</strong> condivisibile su LinkedIn, fattura intestata allo studio, 14 giorni di rimborso.
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-[12px] text-body mb-4">
            <li className="flex gap-1.5 items-start"><span className="text-terracotta font-bold">✓</span> 5 moduli core in più (M2 → M6)</li>
            <li className="flex gap-1.5 items-start"><span className="text-terracotta font-bold">✓</span> Esami di modulo, +3 ✦ ciascuno</li>
            <li className="flex gap-1.5 items-start"><span className="text-terracotta font-bold">✓</span> Certificato finale + share LinkedIn</li>
            <li className="flex gap-1.5 items-start"><span className="text-terracotta font-bold">✓</span> 1 modulo bonus a scelta</li>
            <li className="flex gap-1.5 items-start"><span className="text-terracotta font-bold">✓</span> Fattura intestata allo studio</li>
            <li className="flex gap-1.5 items-start"><span className="text-terracotta font-bold">✓</span> Aggiornamenti a vita</li>
          </ul>
          <div className="flex gap-2 flex-wrap items-center">
            <Link
              href="/checkout?tier=avvocato"
              className="rounded-md bg-terracotta text-white px-5 py-2.5 text-sm font-bold shadow hover:bg-terracotta/90"
            >
              Acquista il corso, €79
            </Link>
            <Link
              href="/#prezzi"
              className="rounded-md border border-line bg-white text-ink px-5 py-2.5 text-sm font-semibold hover:border-terracotta hover:text-terracotta"
            >
              Vedi tutti i piani
            </Link>
          </div>
        </div>
        <div className="hidden sm:flex shrink-0 flex-col items-center justify-center text-center bg-white border border-terracotta rounded-lg px-5 py-4 min-w-[120px]">
          <div className="font-serif text-3xl font-bold text-terracotta tabular-nums leading-none">€79</div>
          <div className="text-[10px] uppercase tracking-widest text-muted mt-1.5 leading-tight">una tantum<br />IVA inclusa</div>
        </div>
      </div>
    </section>
  );
}
