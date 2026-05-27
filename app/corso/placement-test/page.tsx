import Link from 'next/link';
import { PlacementTest } from '../../../components/course/PlacementTest';

/**
  * Placement test, 5 questions covering the first three core modules.
  * Score band determines starting point:
  *  0-1 correct → start from Modulo 1 (no skip)
  *  2-3 correct → skip Modulo 1 (auto-pass M1 lessons + exam) → start M2
  *  4-5 correct → skip Moduli 1-2 → start M3
  *
  * Skipping auto-marks reads + quiz-passes in localStorage so the gating chain
  * stays consistent; no separate "skipped" state.
  */
const DOMANDE = [
  {
    domanda: 'Cosa rende Claude diverso da un motore di ricerca per un avvocato?',
    opzioni: [
      'È più veloce',
      'È una macchina di trasformazione del linguaggio, non di ricerca',
      'Costa meno',
      'Funziona offline',
    ],
    corretta: 1,
  },
  {
    domanda: 'Qual è la formula base di un buon prompt?',
    opzioni: [
      'Saluto + richiesta + ringraziamento',
      'Ruolo + Task + Vincoli',
      'Cliente + importo + scadenza',
      'Citazione + articolo + comma',
    ],
    corretta: 1,
  },
  {
    domanda: 'Quale superficie di Claude scegli per consultare ripetutamente un dossier di cliente?',
    opzioni: [
      'Chat normale',
      'Projects (con i documenti caricati)',
      'API',
      'MCP',
    ],
    corretta: 1,
  },
  {
    domanda: 'Dove configurare lo stile dello studio (formule da evitare, firma)?',
    opzioni: [
      'Nel singolo prompt, ogni volta',
      'Nelle Custom Instructions dell\'account',
      'In una nota cartacea',
      'Nel CRM dello studio',
    ],
    corretta: 1,
  },
  {
    domanda: 'Quali dati di clienti puoi mettere in un prompt su un piano consumer di Claude?',
    opzioni: [
      'Tutti, è privato',
      'Solo dati anonimizzati o non identificabili (salvo configurazioni Team/Cowork)',
      'Solo nomi e indirizzi',
      'Nessun dato',
    ],
    corretta: 1,
  },
];

export default function PlacementTestPage() {
  return (
    <article>
      <nav className="text-xs text-muted mb-4 flex items-center gap-1.5">
        <Link href="/corso" className="hover:text-terracotta">Corso</Link>
        <span className="text-line">/</span>
        <span className="text-ink">Test di livello</span>
      </nav>

      <div className="text-xs uppercase tracking-widest text-terracotta font-bold mb-3">Hai già esperienza?</div>
      <h1 className="font-serif text-4xl font-bold leading-tight mb-2">Test di livello iniziale</h1>
      <p className="font-serif text-lg text-muted leading-snug italic mb-1">
        5 domande, 3 minuti. Saltiamo i moduli che già padroneggi.
      </p>
      <div className="text-xs text-muted mb-10">
        Una sola volta. Se non ti convince, puoi sempre iniziare dal Modulo 1.
      </div>

      <PlacementTest domande={DOMANDE} />
    </article>
  );
}
