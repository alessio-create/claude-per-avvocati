import { Glossario } from '../../../components/course/Glossario';

export const metadata = {
  title: 'Glossario · Claude per Avvocati',
  description:
    '30 termini chiave del corso, organizzati in quattro categorie: tecnologia Claude, diritto e compliance, pratica avvocatizia, concetti del corso.',
};

export default function GlossarioPage() {
  return (
    <article>
      <nav className="text-xs text-muted mb-6">
        <a href="/corso" className="hover:text-terracotta">← Indice del corso</a>
      </nav>

      <div className="text-xs uppercase tracking-widest text-terracotta font-bold mb-3">Glossario</div>
      <h1 className="font-serif text-4xl font-bold leading-tight mb-2">30 termini del corso, in italiano.</h1>
      <p className="font-serif text-lg text-muted leading-snug italic mb-1">
        Quattro categorie. Definizioni orientate alla pratica, non al manuale.
      </p>
      <div className="text-xs text-muted mb-10">Aggiornato 2026-05-26</div>

      <Glossario />
    </article>
  );
}
