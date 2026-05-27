import Link from 'next/link';
import { Certificazione } from '../../../components/course/Certificazione';
import { CertificazioneGate } from '../../../components/course/CertificazioneGate';

/**
  * Final certification quiz. One question per module (9 total).
  * Pass threshold: 7/9 (≈78%). Reward: +50 ✦ and a printable certificate UI.
  */
const DOMANDE = [
  {
    modulo: '01, Fondamenta',
    domanda: 'I tre elementi che ogni prompt utile dovrebbe contenere sono:',
    opzioni: [
      'Saluto, richiesta, ringraziamento',
      'Ruolo, task specifico, vincoli',
      'Citazione, articolo, comma',
      'Cliente, importo, scadenza',
    ],
    corretta: 1,
    spiega: 'Ruolo + Task + Vincoli è il template universale di Modulo 1.',
  },
  {
    modulo: '02, Le superfici di Claude',
    domanda: 'Quando Project batte Chat per uno studio legale?',
    opzioni: [
      'Mai, Chat è sempre meglio',
      'Quando la pratica ha più documenti consultati ripetutamente',
      'Solo per studi con più di 5 avvocati',
      'Solo per consulenze pro bono',
    ],
    corretta: 1,
    spiega: 'I Project condividono contesto persistente tra conversazioni. Per una pratica con dossier consultato ricorrentemente, è la scelta giusta.',
  },
  {
    modulo: '03, Setup & stile',
    domanda: 'Dove conviene impostare lo stile dello studio (formule da evitare, firma, registro)?',
    opzioni: [
      'In ogni singolo prompt',
      'Nelle Custom Instructions globali dell\'account',
      'In un file Word sul desktop',
      'Nel CRM',
    ],
    corretta: 1,
    spiega: 'Le Custom Instructions si applicano automaticamente a ogni nuova conversazione, senza dover ripetere lo stile.',
  },
  {
    modulo: '04, Casi d\'uso legali',
    domanda: 'Per un parere su una questione complessa, qual è l\'approccio migliore?',
    opzioni: [
      'Chiedere a Claude di scrivere il parere completo direttamente',
      'Usare Claude per strutturare argomenti e raccogliere fonti, poi rifinire e verificare manualmente',
      'Copiare un parere precedente e cambiare i nomi',
      'Non usare Claude per pareri, troppo rischioso',
    ],
    corretta: 1,
    spiega: 'Claude è eccellente come acceleratore strutturale. La verifica delle fonti e il giudizio professionale restano responsabilità tua.',
  },
  {
    modulo: '05, Skills',
    domanda: 'Cosa rende una Skill diversa da un buon prompt?',
    opzioni: [
      'Nulla, è solo un altro nome',
      'Una Skill è una procedura riutilizzabile con istruzioni, esempi e (opzionalmente) file di supporto',
      'Le Skills costano di più',
      'Le Skills sono solo in inglese',
    ],
    corretta: 1,
    spiega: 'Una Skill incapsula un workflow ricorrente: una volta scritta, la richiami con una frase invece di riscrivere il prompt da capo ogni volta.',
  },
  {
    modulo: '06, Privacy & deontologia',
    domanda: 'Quali dati di clienti puoi inserire in un prompt di Claude su piano consumer?',
    opzioni: [
      'Tutti, sono privati per definizione',
      'Solo dati anonimizzati o non identificabili, salvo configurazioni specifiche del piano',
      'Solo nomi e indirizzi',
      'Solo dati di clienti deceduti',
    ],
    corretta: 1,
    spiega: 'La regola di base è anonimizzare. Per dati reali identificabili servono workspace Team/Cowork con DPA firmato.',
  },
  {
    modulo: '07, Cowork',
    domanda: 'Cowork rispetto a Pro individuali introduce:',
    opzioni: [
      'Funzioni grafiche',
      'Workspace condiviso dello studio con admin, audit log e DPA a livello organizzativo',
      'Sconto per studenti',
      'Integrazione con Excel',
    ],
    corretta: 1,
    spiega: 'Cowork è il salto da uso individuale a vero asset di studio: governance, accessi, condivisione di Project e Skill.',
  },
  {
    modulo: '08, Claude Code',
    domanda: 'Cosa rende Claude Code radicalmente diverso dalla Chat?',
    opzioni: [
      'Costa meno',
      'Legge, modifica e scrive direttamente file sul tuo computer (con il tuo permesso)',
      'È disponibile solo in inglese',
      'Funziona solo su Mac',
    ],
    corretta: 1,
    spiega: 'Accesso al file system. Workflow ripetitivi su molti file (rinominare 280 documenti, estrarre dati da contratti, generare report) diventano questioni di minuti.',
  },
  {
    modulo: '09, App & Schedule',
    domanda: 'Cosa NON dovresti mettere in Schedule?',
    opzioni: [
      'Estrazione settimanale delle scadenze',
      'Monitoraggio della Gazzetta Ufficiale',
      'Decisioni che richiedono giudizio professionale (es. accettare un nuovo cliente)',
      'Generazione bozze di fattura mensili',
    ],
    corretta: 2,
    spiega: 'Schedule è per estrazione, monitoraggio, reporting. Le decisioni di giudizio restano sempre nelle tue mani.',
  },
];

export default function CertificazionePage() {
  return (
    <article>
      <nav className="text-xs text-muted mb-4 flex items-center gap-1.5">
        <Link href="/corso" className="hover:text-terracotta">Corso</Link>
        <span className="text-line">/</span>
        <span className="text-ink">Certificazione</span>
      </nav>

      <div className="text-xs uppercase tracking-widest text-terracotta font-bold mb-3">Prova finale del corso</div>
      <h1 className="font-serif text-4xl font-bold leading-tight mb-2">Certificazione</h1>
      <p className="font-serif text-lg text-muted leading-snug italic mb-1">
        Una domanda per ciascuno dei 9 moduli core (M1–M9). Pass: 7/9. Ricompensa: +50 ✦ e certificato scaricabile.
      </p>
      <div className="text-xs text-muted mb-10">
        Hai completato i 9 moduli core? È il momento di consolidare. Il <strong>Modulo 10, Kit Pratico</strong>, è una risorsa di riferimento, non rientra nella prova finale.
      </div>

      <CertificazioneGate>
        <Certificazione domande={DOMANDE} passaCon={7} />
      </CertificazioneGate>
    </article>
  );
}
