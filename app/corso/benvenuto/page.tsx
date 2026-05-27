import Link from 'next/link';
import { ClaudeStar } from '../../../components/illustration/ClaudeStar';
import { ClaudeMascot } from '../../../components/illustration/ClaudeMascot';
import { EsameBadge } from '../../../components/course/EsameBadge';
import { LockIcon } from '../../../components/illustration/LockIcon';

export const metadata = {
  title: 'Benvenuto · Claude per Avvocati',
  description:
    'Tour del corso in 7 punti: dove sta cosa, come funziona la progressione a gemme, il test di livello, il glossario, il piano 30 giorni, i moduli bonus, la certificazione.',
};

interface Step {
  num: string;
  titolo: string;
  descrizione: string;
  cta: { label: string; href: string };
  highlight?: boolean;
}

const STEPS: Step[] = [
  {
    num: '01',
    titolo: 'Dove vivi: l\'indice del corso',
    descrizione:
      'Il corso è organizzato in 10 moduli, 6 core (Fondamenta, Superfici, Setup & stile, Casi d\'uso legali, Skills, Privacy) + 4 bonus. Tutti li trovi nella sidebar a sinistra di ogni pagina del corso. Cliccaci sopra per aprire una lezione. Quando vuoi tornare alla mappa generale, c\'è "Indice del corso" in cima a ogni lezione.',
    cta: { label: 'Vai all\'indice', href: '/corso' },
  },
  {
    num: '02',
    titolo: 'Come funziona la progressione',
    descrizione:
      'Le lezioni di ogni modulo vanno lette in ordine: completando una si sblocca la successiva. Alla fine di ogni modulo c\'è un esame: superandolo si sblocca il modulo seguente. Ogni lezione letta ti dà 1 gemma (✦), ogni esame superato 3 gemme, ogni modulo completato 10 extra. La barra in alto mostra sempre la tua percentuale globale.',
    cta: { label: 'Vai al Modulo 1', href: '/corso/01-fondamenta/00-benvenuto' },
    highlight: true,
  },
  {
    num: '03',
    titolo: 'Hai già esperienza? Fai il test di livello',
    descrizione:
      'Se Claude lo conosci già, non perdere tempo coi moduli base. Il test di livello sono 5 domande in 3 minuti. Punteggio 0-1: parti dal Modulo 1. 2-3: salti al Modulo 2. 4-5: salti direttamente al Modulo 3. Lo fai una sola volta, poi parti dal punto giusto per te.',
    cta: { label: 'Fai il test (3 min)', href: '/corso/placement-test' },
  },
  {
    num: '04',
    titolo: 'Glossario, 30 termini con definizioni pratiche',
    descrizione:
      'Ogni volta che incontri un termine tecnico (token, MCP, DPA, allucinazione, foro convenzionale, ecc.) trovi la definizione nel glossario, scritta dal punto di vista pratico di uno studio italiano, non da quello del manuale. C\'è una ricerca veloce per termine, sigla o articolo di legge.',
    cta: { label: 'Apri il glossario', href: '/corso/glossario' },
  },
  {
    num: '05',
    titolo: 'Piano 30 giorni, un\'azione al giorno',
    descrizione:
      'Il corso ti dà la teoria. Il piano 30 giorni ti dà il ritmo. Sei settimane (setup, drafting, skills, projects, privacy, automazione), un\'azione concreta al giorno (10-90 minuti), ogni giorno produce un artefatto reale. Puoi marcare i giorni completati e vedere la tua progressione.',
    cta: { label: 'Apri il piano', href: '/corso/30-giorni' },
  },
  {
    num: '06',
    titolo: 'Quattro moduli bonus, sbloccabili con gemme',
    descrizione:
      'Oltre ai 6 moduli core, ci sono 4 moduli bonus: Cowork (30 ✦), Claude Code per avvocati (40 ✦), App & Schedule (30 ✦), Kit Pratico (50 ✦). Si sbloccano con le gemme che guadagni leggendo le lezioni e superando gli esami. Col piano Studio sono inclusi tutti, senza spendere gemme.',
    cta: { label: 'Vedi i moduli bonus', href: '/corso#bonus' },
  },
  {
    num: '07',
    titolo: 'Certificazione finale + status Pioneer',
    descrizione:
      'Alla fine del percorso ti aspetta la prova finale: 9 domande, una per modulo. Pass: 7/9. Ottieni il certificato Claude per Avvocati, 50 gemme extra, due bottoni per condividerlo su LinkedIn (anche aggiungendolo direttamente al tuo profilo). Completando tutto raggiungi il "Livello 5: Pioneer", lo status più alto del corso.',
    cta: { label: 'Vedi la prova finale', href: '/corso/certificazione' },
  },
];

export default function BenvenutoPage() {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Hero */}
      <header className="text-center mb-12">
        <div className="flex justify-center mb-5">
          <div className="anim-float">
            <ClaudeMascot variant="happy" size={72} />
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-cream-panel border border-line rounded-full px-3 py-1.5 text-[10px] text-terracotta font-bold tracking-widest uppercase mb-4">
          <ClaudeStar size={12} />
          Benvenuto · Tour in 7 punti
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-[1.05] mb-3">
          Tre minuti per orientarti.
        </h1>
        <p className="font-serif text-lg text-muted leading-snug italic mb-2">
          Dove sta cosa, come funziona la progressione, da dove iniziare.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          Salvati questa pagina, oppure lasciala perdere: puoi sempre riaprirla
          dalla sidebar quando vuoi.
        </p>
      </header>

      {/* Steps */}
      <div className="space-y-5 mb-12">
        {STEPS.map((s) => (
          <StepCard key={s.num} step={s} />
        ))}
      </div>

      {/* Final CTA: starting point recommendation */}
      <section className="rounded-2xl border-2 border-terracotta bg-gradient-to-br from-white to-cream-panel p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <EsameBadge size={28} className="text-terracotta" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">
              Pronto per iniziare?
            </div>
            <h2 className="font-serif text-2xl font-bold mb-3">
              Apri il Modulo 1, leggi 3 minuti.
            </h2>
            <p className="text-sm text-body leading-relaxed mb-5">
              Il primo modulo è la <strong>welcome</strong> di Fondamenta. Ti spiega in 3 minuti
              cosa aspettarti dal corso e cosa portare con te. Niente teoria, niente filosofia:
              setta il modello mentale giusto per i 5 moduli successivi.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/corso/01-fondamenta/00-benvenuto"
                className="bg-terracotta text-white px-6 py-3 rounded-md font-bold text-sm shadow hover:bg-terracotta/90"
              >
                Apri il Modulo 1 →
              </Link>
              <Link
                href="/corso/placement-test"
                className="border border-line bg-white text-ink px-5 py-3 rounded-md font-semibold text-sm hover:border-terracotta hover:text-terracotta transition-colors"
              >
                Hai esperienza? Fai prima il test
              </Link>
            </div>
          </div>
        </div>
      </section>

      <p className="text-xs text-muted text-center mt-8">
        Hai dubbi o vuoi proporre un miglioramento? Scrivici a{' '}
        <a href="mailto:fatture@claudeperavvocati.it" className="text-terracotta hover:underline">
          fatture@claudeperavvocati.it
        </a>
        .
      </p>
    </article>
  );
}

function StepCard({ step }: { step: Step }) {
  const borderClass = step.highlight ? 'border-terracotta' : 'border-line';
  const bgClass = step.highlight ? 'bg-gradient-to-br from-white to-cream-panel' : 'bg-white';
  return (
    <section className={`rounded-xl border-2 ${borderClass} ${bgClass} p-5 sm:p-6 transition-shadow hover:shadow-md`}>
      <div className="grid sm:grid-cols-[auto_1fr] gap-4 sm:gap-5">
        <div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-terracotta text-white font-serif font-bold text-xl tabular-nums">
            {step.num}
          </div>
        </div>
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight mb-2 text-ink">
            {step.titolo}
          </h2>
          <p className="text-sm text-body leading-relaxed mb-4 m-0">
            {step.descrizione}
          </p>
          <Link
            href={step.cta.href}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-terracotta hover:underline"
          >
            {step.cta.label} →
          </Link>
        </div>
      </div>
    </section>
  );
}
