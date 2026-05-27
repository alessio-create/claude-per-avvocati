import { Calendario30Giorni } from '../../../components/course/Calendario30Giorni';
import { CALENDARIO } from '../../../lib/calendario';

export const metadata = {
  title: 'Trenta giorni per cambiare la pratica · Claude per Avvocati',
  description:
    '30 azioni concrete, una al giorno, ognuna 10-90 minuti. Da Day 0 a uno studio integrato con Claude end-to-end.',
};

export default function CalendarioPage() {
  const totalMinuti = CALENDARIO.reduce((sum, g) => sum + g.tempo, 0);
  const ore = Math.floor(totalMinuti / 60);
  const minuti = totalMinuti % 60;

  return (
    <article>
      <nav className="text-xs text-muted mb-6">
        <a href="/corso" className="hover:text-terracotta">← Indice del corso</a>
      </nav>

      <div className="text-xs uppercase tracking-widest text-terracotta font-bold mb-3">
        Calendario · 30 giorni
      </div>
      <h1 className="font-serif text-4xl md:text-5xl font-bold leading-[1.05] mb-3">
        Trenta giorni per cambiare la pratica con Claude.
      </h1>
      <p className="font-serif text-lg text-muted leading-snug italic mb-5">
        Un&apos;azione al giorno, 10-90 minuti, ogni giorno produce un artefatto reale.
      </p>
      <div className="text-xs text-muted mb-8">
        Investimento totale: <strong className="text-ink tabular-nums">{ore}h {minuti}min</strong>{' '}
        spalmati su 30 giorni · circa <strong className="text-ink tabular-nums">{Math.round(totalMinuti / 30)} min/giorno</strong>{' '}
        di media
      </div>

      <p className="text-body leading-relaxed mb-10">
        Il corso ti dà la teoria e le componenti. Questo calendario ti dà il <strong>ritmo</strong>.
        Sei settimane: <strong>setup base</strong>, <strong>drafting</strong>, <strong>skills</strong>,{' '}
        <strong>projects</strong>, <strong>privacy & governance</strong>, <strong>automazione</strong>.
        Ogni giorno è hands-on: niente "comprendi X", solo "fa X e ti porti a casa Y".
      </p>

      <Calendario30Giorni />
    </article>
  );
}
