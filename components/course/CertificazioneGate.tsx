'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useTier } from '../../lib/use-tier';
import { canAccessCertification } from '../../lib/access';
import { LockIcon } from '../illustration/LockIcon';
import { ClaudeStar } from '../illustration/ClaudeStar';

/**
 * Wraps the certification quiz. Free / anonymous users see a dedicated
 * "Sblocca la certificazione" panel that links to checkout; paid tiers
 * pass through to the quiz UI.
 */
export function CertificazioneGate({ children }: { children: ReactNode }) {
  const me = useTier();

  if (me === null) {
    return <div className="min-h-[40vh]" aria-hidden />;
  }

  if (canAccessCertification(me.tier)) {
    return <>{children}</>;
  }

  return (
    <div className="my-8 rounded-xl border-2 border-terracotta bg-gradient-to-br from-white to-cream-panel p-8 shadow-md">
      <div className="flex items-start gap-5 flex-wrap">
        <div className="shrink-0">
          <div className="relative">
            <ClaudeStar size={56} />
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-ink text-cream flex items-center justify-center shadow">
              <LockIcon size={14} className="text-cream" />
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-[240px]">
          <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">
            Riservata agli iscritti
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2 leading-tight">
            Sblocca la certificazione
          </h2>
          <p className="text-sm text-body leading-snug mb-4 m-0">
            La prova finale (9 domande, una per modulo) e il certificato condivisibile su
            LinkedIn sono inclusi nel piano <strong>Avvocato (€79)</strong>. Con la stessa iscrizione apri anche i Moduli 2–6, fattura intestata allo studio, 14 giorni di rimborso.
          </p>
          <ul className="space-y-1 mb-5 text-[12px] text-body">
            <li className="flex gap-2 items-start"><span className="text-terracotta font-bold">✓</span> 9 domande, pass 7/9, certificato stampabile</li>
            <li className="flex gap-2 items-start"><span className="text-terracotta font-bold">✓</span> Condivisione 1-click su LinkedIn con punteggio</li>
            <li className="flex gap-2 items-start"><span className="text-terracotta font-bold">✓</span> +50 ✦ in regalo quando passi</li>
          </ul>
          <div className="flex gap-2 flex-wrap items-center">
            <Link
              href="/checkout?tier=avvocato"
              className="rounded-md bg-terracotta text-white px-5 py-2.5 text-sm font-bold shadow hover:bg-terracotta/90"
            >
              Acquista la certificazione, €79
            </Link>
            <Link
              href="/#prezzi"
              className="rounded-md border border-line bg-white text-ink px-5 py-2.5 text-sm font-semibold hover:border-terracotta hover:text-terracotta"
            >
              Confronta i piani
            </Link>
            <span className="text-[11px] text-muted ml-1">Pagamento sicuro · Fattura inclusa · Rimborso 14 giorni</span>
          </div>
        </div>
      </div>
    </div>
  );
}
