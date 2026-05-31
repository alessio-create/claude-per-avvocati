'use client';
import { useEffect, useState } from 'react';
import { hasPassedQuiz, rewardEsamePass, rewardQuizPass } from '../../lib/gems';
import { markCompleted } from '../../lib/progress';
import { ExamCelebration } from './ExamCelebration';

interface Domanda {
  domanda: string;
  opzioni: string[];
  corretta: number; // index into opzioni
  spiega?: string; // optional explanation shown after answer
}

interface QuizProps {
  modulo: string;
  lezione: string;
  domande: Domanda[];
  passaCon?: number; // min correct to pass; default = all
  /** Override the header eyebrow + title. Defaults: "Verifica" / "Hai capito? Tre domande." */
  etichetta?: string;
  titolo?: string;
  /** Reward shown in the corner. Defaults: "+3 ✦" (verifica) or "+5–10 ✦" (esame). */
  ricompensa?: string;
  /** "verifica" = end-of-lesson quiz (3 gems flat). "esame" = end-of-module exam
   *  (random 5–10 gems on first pass + Duolingo-style celebration overlay). */
  tipo?: 'verifica' | 'esame';
}

type AnswerState = number | null;

const NUMERI_IT = ['zero', 'una', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci'];

export function Quiz({
  modulo,
  lezione,
  domande,
  passaCon,
  etichetta = 'Verifica',
  titolo,
  ricompensa,
  tipo = 'verifica',
}: QuizProps) {
  const isEsame = tipo === 'esame';
  const need = passaCon ?? domande.length;
  const titleFinal = titolo ?? `Hai capito? ${NUMERI_IT[domande.length] ?? domande.length} domande.`;
  const ricompensaFinal = ricompensa ?? (isEsame ? '+5–10 ✦' : '+3 ✦');

  const [answers, setAnswers] = useState<AnswerState[]>(() => domande.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [alreadyPassed, setAlreadyPassed] = useState(false);
  const [justEarnedGems, setJustEarnedGems] = useState(false);
  /** When > 0, the ExamCelebration overlay is shown with this gem count.
   *  Only fires for tipo='esame' on first pass; cleared on dismiss. */
  const [celebrationGems, setCelebrationGems] = useState(0);

  // On mount, check if this quiz was already passed in a previous session
  useEffect(() => {
    if (hasPassedQuiz(modulo, lezione)) {
      setAlreadyPassed(true);
      setSubmitted(true);
      // Pre-fill with correct answers for display
      setAnswers(domande.map((d) => d.corretta));
    }
  }, [modulo, lezione, domande]);

  const correctCount = answers.reduce<number>(
    (acc, a, i) => acc + (a === domande[i].corretta ? 1 : 0),
    0,
  );
  const allAnswered = answers.every((a) => a !== null);
  const passed = submitted && correctCount >= need;

  const onSubmit = () => {
    setSubmitted(true);
    if (correctCount >= need) {
      if (isEsame) {
        const gems = rewardEsamePass(modulo, lezione);
        markCompleted(modulo, lezione);
        if (gems > 0) {
          setJustEarnedGems(true);
          setCelebrationGems(gems);
        }
      } else {
        const newlyAwarded = rewardQuizPass(modulo, lezione);
        markCompleted(modulo, lezione);
        if (newlyAwarded) setJustEarnedGems(true);
      }
    }
  };

  const onRetry = () => {
    setAnswers(domande.map(() => null));
    setSubmitted(false);
    setJustEarnedGems(false);
  };

  return (
    <section className="my-10 rounded-xl border-2 border-terracotta bg-white p-6 shadow-md">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold">{etichetta}</div>
          <h3 className="font-serif text-xl font-bold text-ink m-0 mt-1">{titleFinal}</h3>
        </div>
        <div className="text-xs text-muted shrink-0 text-right">
          Pass: <strong className="text-ink">{need}/{domande.length}</strong>
          <br />
          Ricompensa: <strong className="text-terracotta">{ricompensaFinal}</strong>
        </div>
      </div>

      {alreadyPassed && (
        <div className="mb-4 rounded-md bg-cream-panel p-3 text-sm text-body">
          ✓ Hai già superato questa verifica in una sessione precedente. Risposte corrette mostrate sotto.
        </div>
      )}

      <ol className="space-y-6 m-0 p-0 list-none">
        {domande.map((d, qi) => {
          const myAnswer = answers[qi];
          return (
            <li key={qi}>
              <div className="font-serif font-bold text-base text-ink mb-3">
                {qi + 1}. {d.domanda}
              </div>
              <div className="grid gap-2">
                {d.opzioni.map((opt, oi) => {
                  const isMine = myAnswer === oi;
                  const isCorrect = d.corretta === oi;
                  const showRight = submitted && isCorrect;
                  const showWrong = submitted && isMine && !isCorrect;
                  let cls = 'border border-line bg-white text-body hover:border-terracotta hover:bg-cream-panel cursor-pointer';
                  if (showRight) cls = 'border-2 border-[#6fa28b] bg-[#f0ebda] text-ink font-semibold';
                  else if (showWrong) cls = 'border-2 border-terracotta bg-[#fef5ee] text-ink';
                  else if (isMine) cls = 'border-2 border-terracotta bg-cream-panel text-ink font-medium';
                  return (
                    <label key={oi} className={`flex gap-3 items-start rounded-md p-3 text-sm transition-colors ${cls}`}>
                      <input
                        type="radio"
                        name={`q-${qi}`}
                        className="mt-0.5 accent-terracotta"
                        checked={isMine}
                        disabled={submitted}
                        onChange={() => {
                          if (submitted) return;
                          setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)));
                        }}
                      />
                      <span className="flex-1">{opt}</span>
                      {showRight && <span className="text-[#6fa28b] font-bold shrink-0">✓</span>}
                      {showWrong && <span className="text-terracotta font-bold shrink-0">✕</span>}
                    </label>
                  );
                })}
              </div>
              {submitted && d.spiega && (
                <p className="mt-2 text-xs text-muted italic m-0">{d.spiega}</p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-7 pt-5 border-t border-line">
        {!submitted ? (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs text-muted">
              {allAnswered ? 'Pronto a verificare?' : `Rispondi a tutte (${answers.filter(Boolean).length}/${domande.length})`}
            </div>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!allAnswered}
              className="rounded-md bg-terracotta text-white px-5 py-2.5 text-sm font-bold disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-colors"
            >
              Verifica risposte
            </button>
          </div>
        ) : passed ? (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-sm text-ink">
              ✓ <strong className="text-[#6fa28b]">Passato</strong> con {correctCount}/{domande.length}.
              {justEarnedGems && (
                <span className="ml-2 text-terracotta font-bold">
                  {isEsame && celebrationGems > 0 ? `+${celebrationGems} ✦` : ricompensaFinal} guadagnati!
                </span>
              )}
              <span className="block text-xs text-muted mt-1">La prossima lezione è ora sbloccata.</span>
            </div>
            <button type="button" onClick={onRetry} className="text-xs text-muted hover:text-terracotta underline">
              Rispondi di nuovo
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-sm text-ink">
              ✕ <strong className="text-terracotta">{correctCount}/{domande.length}</strong>. Serve {need}/{domande.length} per sbloccare la prossima lezione.
              <span className="block text-xs text-muted mt-1">Rileggi le sezioni rilevanti e riprova.</span>
            </div>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-md bg-ink text-cream px-5 py-2.5 text-sm font-bold hover:bg-terracotta transition-colors"
            >
              Riprova
            </button>
          </div>
        )}
      </div>

      {celebrationGems > 0 && (
        <ExamCelebration
          gems={celebrationGems}
          onClose={() => setCelebrationGems(0)}
        />
      )}
    </section>
  );
}
