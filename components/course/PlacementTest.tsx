'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { hasPlacement, recordPlacement } from '../../lib/gems';

interface Domanda {
  domanda: string;
  opzioni: string[];
  corretta: number;
}

interface PlacementResult {
  livello: 1 | 2 | 3;
  startModulo: string;
  titoloPercorso: string;
  descrizione: string;
  /** Lesson keys to auto-mark as read + quiz-passed so the unlock chain skips ahead. */
  autoCompleted: string[];
}

const M01_LESSONS = [
  '01-fondamenta/01-cosa-e-claude',
  '01-fondamenta/02-collega-non-motore',
  '01-fondamenta/03-ecosistema-in-5-minuti',
  '01-fondamenta/04-contesto-e-tutto',
  '01-fondamenta/05-prompt-base-avvocato',
  '01-fondamenta/99-esame-modulo',
];
const M02_LESSONS = [
  '02-superfici/01-chat',
  '02-superfici/02-projects',
  '02-superfici/03-claude-code',
  '02-superfici/04-skills',
  '02-superfici/05-mcp',
  '02-superfici/06-api',
];

function bucket(correct: number): PlacementResult {
  if (correct <= 1) {
    return {
      livello: 1,
      startModulo: '01-fondamenta/01-cosa-e-claude',
      titoloPercorso: 'Parti dal Modulo 1',
      descrizione: 'Le fondamenta sono dove sta tutto il valore. Inizia dall\'inizio.',
      autoCompleted: [],
    };
  }
  if (correct <= 3) {
    return {
      livello: 2,
      startModulo: '02-superfici/01-chat',
      titoloPercorso: 'Salta al Modulo 2',
      descrizione: 'Hai le basi. Iniziamo dalle superfici di Claude (Chat, Projects, Code, Skills, MCP, API).',
      autoCompleted: M01_LESSONS,
    };
  }
  return {
    livello: 3,
    startModulo: '03-setup-stile/01-piani-claude',
    titoloPercorso: 'Salta al Modulo 3',
    descrizione: 'Conosci già bene Claude. Iniziamo direttamente dal setup avanzato e dallo stile dello studio.',
    autoCompleted: [...M01_LESSONS, ...M02_LESSONS],
  };
}

export function PlacementTest({ domande }: { domande: Domanda[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => domande.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [alreadyTaken, setAlreadyTaken] = useState(false);

  useEffect(() => {
    if (hasPlacement()) setAlreadyTaken(true);
  }, []);

  const correctCount = answers.reduce<number>(
    (acc, a, i) => acc + (a === domande[i].corretta ? 1 : 0),
    0,
  );
  const allAnswered = answers.every((a) => a !== null);
  const result = submitted ? bucket(correctCount) : null;

  const onSubmit = () => {
    setSubmitted(true);
    const r = bucket(correctCount);
    recordPlacement(r.livello, r.autoCompleted);
  };

  if (alreadyTaken && !submitted) {
    return (
      <div className="rounded-xl border border-line bg-cream-panel p-6">
        <p className="text-sm text-body m-0">
          Hai già fatto il test di livello in precedenza. Vai al{' '}
          <Link href="/corso" className="text-terracotta font-semibold hover:underline">corso</Link>{' '}
          e riprendi da dove ti sei interrotto.
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="my-10 space-y-5">
        <section className="rounded-xl border-2 border-terracotta bg-white p-8 text-center shadow-sm">
          <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-2">
            Risultato · {correctCount}/{domande.length}
          </div>
          <h2 className="font-serif text-2xl font-bold mb-3">{result.titoloPercorso}</h2>
          <p className="text-sm text-muted leading-snug max-w-md mx-auto mb-6">{result.descrizione}</p>
          <Link
            href={`/corso/${result.startModulo}`}
            className="inline-block rounded-md bg-terracotta text-white font-bold px-5 py-2.5 text-sm hover:bg-terracotta/90"
          >
            → Inizia da qui
          </Link>
        </section>
        {result.autoCompleted.length > 0 && (
          <p className="text-xs text-muted text-center max-w-md mx-auto">
            Abbiamo segnato {result.autoCompleted.length} lezioni come già completate.
            Puoi sempre tornare indietro e leggerle quando vuoi dalla sidebar.
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="my-10 rounded-xl border-2 border-terracotta bg-white p-6 shadow-md">
      <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">Test di livello</div>
      <h3 className="font-serif text-xl font-bold mb-5">5 domande, una risposta sola.</h3>

      <ol className="space-y-7 m-0 p-0 list-none">
        {domande.map((d, qi) => {
          const myAnswer = answers[qi];
          return (
            <li key={qi}>
              <div className="font-serif font-bold text-base text-ink mb-3">{qi + 1}. {d.domanda}</div>
              <div className="grid gap-2">
                {d.opzioni.map((opt, oi) => {
                  const isMine = myAnswer === oi;
                  const cls = isMine
                    ? 'border-2 border-terracotta bg-cream-panel text-ink font-medium'
                    : 'border border-line bg-white text-body hover:border-terracotta hover:bg-cream-panel cursor-pointer';
                  return (
                    <label key={oi} className={`flex gap-3 items-start rounded-md p-3 text-sm transition-colors ${cls}`}>
                      <input
                        type="radio"
                        name={`p-${qi}`}
                        className="mt-0.5 accent-terracotta"
                        checked={isMine}
                        onChange={() => setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))}
                      />
                      <span className="flex-1">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-7 pt-5 border-t border-line flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-muted">
          {allAnswered ? 'Pronto a calcolare il tuo livello?' : `Rispondi a tutte (${answers.filter((a) => a !== null).length}/${domande.length})`}
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!allAnswered}
          className="rounded-md bg-terracotta text-white px-5 py-2.5 text-sm font-bold disabled:bg-line disabled:text-muted disabled:cursor-not-allowed"
        >
          Mostra il mio livello
        </button>
      </div>
    </section>
  );
}
