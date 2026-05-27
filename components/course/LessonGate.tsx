'use client';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { hasPassedQuiz, hasReadLesson, hasBonusUnlocked, spendOnBonus, getGems } from '../../lib/gems';
import { LockIcon } from '../illustration/LockIcon';
import { useTier } from '../../lib/use-tier';
import { hasAllBonus, isPaid } from '../../lib/access';

interface PreviousLesson {
  modulo: string;
  lezione: string;
  titolo: string;
  hasQuiz: boolean;
}

interface BonusInfo {
  moduloSlug: string;
  titolo: string;
  costoGemme: number;
}

interface TierGateInfo {
  /** true when the user's current tier blocks this lesson outright (paywall). */
  tierLocked: boolean;
  /** human-readable module name shown in the paywall card. */
  moduloTitolo: string;
}

/**
 * Wraps lesson content. Three gates, checked in order:
 *  0. Tier paywall: free tier can only access Modulo 1 (5 lessons + esame).
 *     Moduli 2..6 are entirely paywalled.
 *  1. Bonus module not unlocked: spend-gems UI (skipped for studio+ tier,
 *     which has all bonus modules included in the plan).
 *  2. Previous lesson not complete: "go back and finish" UI.
 */
export function LessonGate({
  previous,
  bonus,
  tierGate,
  children,
}: {
  previous: PreviousLesson | null;
  bonus: BonusInfo | null;
  tierGate: TierGateInfo;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const [prevUnlocked, setPrevUnlocked] = useState(false);
  const [gemTotal, setGemTotal] = useState(0);
  const [spendError, setSpendError] = useState<string | null>(null);
  const me = useTier();
  const tier = me?.tier ?? null;

  useEffect(() => {
    const refresh = () => {
      setBonusUnlocked(bonus ? hasBonusUnlocked(bonus.moduloSlug) : true);
      setPrevUnlocked(
        !previous
          ? true
          : previous.hasQuiz
            ? hasPassedQuiz(previous.modulo, previous.lezione)
            : hasReadLesson(previous.modulo, previous.lezione),
      );
      setGemTotal(getGems().total);
    };
    refresh();
    setReady(true);
    window.addEventListener('cpa-gems-changed', refresh);
    return () => window.removeEventListener('cpa-gems-changed', refresh);
  }, [previous, bonus]);

  // Wait for both the gem state AND the tier fetch before deciding anything.
  if (!ready || me === null) return <div className="min-h-[40vh]" aria-hidden />;

  // Gate 0: tier paywall (free tier hitting a paid lesson)
  if (tierGate.tierLocked && !isPaid(tier)) {
    return (
      <div className="min-h-[55vh] flex items-center justify-center">
        <div className="max-w-lg text-center border-2 border-terracotta rounded-md bg-white p-8 shadow-sm">
          <div className="flex justify-center mb-3">
            <LockIcon size={40} className="text-terracotta" />
          </div>
          <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">Piano richiesto</div>
          <h2 className="font-serif text-2xl font-bold mb-2">{tierGate.moduloTitolo}</h2>
          <p className="text-muted text-sm leading-snug mb-4">
            Il piano gratis dà accesso completo al Modulo 1. Con <strong>€79 una tantum</strong> apri tutti i moduli rimanenti, la certificazione e ricevi fattura intestata allo studio.
          </p>
          <ul className="inline-block text-left text-[12px] text-body space-y-1 mb-5">
            <li className="flex gap-2 items-start"><span className="text-terracotta font-bold">✓</span> Moduli 2–6 completi + esami</li>
            <li className="flex gap-2 items-start"><span className="text-terracotta font-bold">✓</span> Certificato finale condivisibile su LinkedIn</li>
            <li className="flex gap-2 items-start"><span className="text-terracotta font-bold">✓</span> 1 modulo bonus a scelta · aggiornamenti a vita</li>
            <li className="flex gap-2 items-start"><span className="text-terracotta font-bold">✓</span> Fattura intestata allo studio · 14 giorni di rimborso</li>
          </ul>
          <div className="flex gap-2 justify-center flex-wrap">
            <Link
              href="/checkout?tier=avvocato"
              className="rounded-md bg-terracotta text-white px-5 py-2.5 text-sm font-bold hover:bg-terracotta/90 shadow"
            >
              Acquista il corso + certificazione, €79
            </Link>
            <Link
              href="/#prezzi"
              className="rounded-md border border-line bg-white text-ink px-5 py-2.5 text-sm font-semibold hover:border-terracotta hover:text-terracotta"
            >
              Confronta i piani
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Gate 1: bonus module not unlocked (studio tier auto-passes)
  if (bonus && !bonusUnlocked && !hasAllBonus(tier)) {
    const enough = gemTotal >= bonus.costoGemme;
    const handleSpend = () => {
      setSpendError(null);
      const result = spendOnBonus(bonus.moduloSlug, bonus.costoGemme);
      if (!result.ok) {
        setSpendError(
          result.reason === 'not-enough'
            ? `Ti servono ancora ${bonus.costoGemme - gemTotal} ✦.`
            : 'Già sbloccato.',
        );
      }
    };

    return (
      <div className="min-h-[55vh] flex items-center justify-center">
        <div className="max-w-md text-center border-2 border-terracotta rounded-md bg-white p-8 shadow-sm">
          <div className="flex justify-center mb-3">
            <LockIcon size={40} className="text-terracotta" />
          </div>
          <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">Modulo bonus</div>
          <h2 className="font-serif text-2xl font-bold mb-2">{bonus.titolo}</h2>
          <p className="text-muted text-sm leading-snug mb-5">
            Questo modulo non fa parte del percorso principale. Sbloccalo con le gemme,
            oppure passa al piano <strong>Studio (€149)</strong> per averli tutti inclusi.
          </p>

          <div className="inline-block bg-cream-panel rounded-md px-5 py-3 mb-5">
            <div className="text-2xl font-serif font-bold text-terracotta tabular-nums">
              {bonus.costoGemme} ✦
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted mt-1">
              Costo · hai {gemTotal} ✦
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleSpend}
              disabled={!enough}
              className="rounded-md bg-terracotta text-white px-5 py-2.5 text-sm font-bold disabled:bg-line disabled:text-muted disabled:cursor-not-allowed"
            >
              Sblocca con {bonus.costoGemme} ✦
            </button>
            {!enough && (
              <p className="text-xs text-muted mt-3">
                Continua col percorso principale per guadagnare più gemme, oppure{' '}
                <Link href="/checkout?tier=studio" className="text-terracotta font-semibold hover:underline">
                  passa a Studio per averli tutti inclusi
                </Link>.
              </p>
            )}
            {spendError && <p className="text-xs text-terracotta mt-3">{spendError}</p>}
          </div>
        </div>
      </div>
    );
  }

  // Gate 2: previous lesson not complete
  if (previous && !prevUnlocked) {
    const action = previous.hasQuiz ? 'superare la verifica della' : 'leggere la';
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="max-w-md text-center border border-line rounded-md bg-cream-panel p-8">
          <div className="flex justify-center mb-3">
            <LockIcon size={40} className="text-terracotta" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">Lezione bloccata</h2>
          <p className="text-muted text-sm leading-snug mb-5">
            Per accedere a questa lezione devi prima {action} lezione precedente.
          </p>
          <Link
            href={`/corso/${previous.modulo}/${previous.lezione}`}
            className="inline-block bg-terracotta text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-terracotta/90"
          >
            → {previous.titolo}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
