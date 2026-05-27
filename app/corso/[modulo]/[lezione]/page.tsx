import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCorsoIndex } from '../../../../lib/content';
import { previousGateLesson } from '../../../../lib/unlock';
import { isTierLocked } from '../../../../lib/access';
import { LessonNav } from '../../../../components/course/LessonNav';
import { ProgressDots } from '../../../../components/course/ProgressDots';
import { LessonReadTracker } from '../../../../components/course/LessonReadTracker';
import { LessonGate } from '../../../../components/course/LessonGate';
import { CourseStatsChip } from '../../../../components/course/CourseStatsChip';

interface Params { modulo: string; lezione: string }

export function generateStaticParams() {
  const idx = getCorsoIndex();
  const out: Params[] = [];
  for (const m of idx.moduli) for (const l of m.lezioni) out.push({ modulo: m.slug, lezione: l.slug });
  return out;
}

export default async function Lezione({ params }: { params: Promise<Params> }) {
  const { modulo, lezione } = await params;
  const idx = getCorsoIndex();
  const mod = idx.moduli.find(m => m.slug === modulo);
  const lez = mod?.lezioni.find(l => l.slug === lezione);
  if (!mod || !lez) notFound();

  let MDX;
  try {
    MDX = (await import(`../../../../content/corso/${modulo}/${lezione}.mdx`)).default;
  } catch {
    notFound();
  }

  const previous = previousGateLesson(idx, modulo, lezione);
  const bonus = mod.bonus
    ? { moduloSlug: mod.slug, titolo: mod.titolo, costoGemme: mod.costoGemme ?? 50 }
    : null;

  // Tier-paywall check, evaluated client-side against the user's actual tier
  // inside LessonGate; here we just compute whether THIS lesson is a paywall
  // candidate (i.e. would be blocked for a free user).
  const tierGate = {
    tierLocked: isTierLocked(idx, modulo, lezione, 'free'),
    moduloTitolo: mod.titolo,
  };

  const hasQuiz = lez.quiz;
  const moduleAllLessonKeys = mod.lezioni.map((l) => `${mod.slug}/${l.slug}`);

  return (
    <article>
      <LessonGate previous={previous} bonus={bonus} tierGate={tierGate}>
        <LessonReadTracker modulo={modulo} lezione={lezione} moduleAllLessonKeys={moduleAllLessonKeys} />

        {/* Back-to-index button + breadcrumb + progress chip (replaces the
            former wide sticky progress bar; lives inline with the breadcrumb). */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Link
            href="/corso"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-line bg-white text-terracotta text-xs font-semibold hover:border-terracotta hover:bg-cream-panel transition-colors"
          >
            <span aria-hidden>←</span> Indice del corso
          </Link>
          <nav className="text-xs text-muted flex items-center gap-1.5">
            <span className="text-line hidden sm:inline">·</span>
            <span className="hidden sm:inline">M{String(mod.ordine).padStart(2, '0')} · {mod.titolo}</span>
            <span className="text-line">/</span>
            <span className="text-ink">Lezione {lez.ordine}</span>
          </nav>
          <CourseStatsChip index={idx} className="ml-auto" />
        </div>

        <ProgressDots index={idx} currentModulo={modulo} currentLezione={lezione} />

        <div className="text-xs uppercase tracking-widest text-terracotta font-bold mb-3 mt-2">
          {lez.durata} min di lettura{hasQuiz ? ' · con verifica (+3 ✦)' : ''}
        </div>

        <h1 className="font-serif text-4xl font-bold leading-tight mb-2">{lez.titolo}</h1>
        <p className="font-serif text-lg text-muted leading-snug italic mb-1">{lez.sottotitolo}</p>
        <div className="text-xs text-muted mb-10">Aggiornato {lez.aggiornato}</div>

        <div className="max-w-none">
          <MDX />
        </div>

        <LessonNav index={idx} modulo={modulo} lezione={lezione} hasQuiz={hasQuiz} />
      </LessonGate>
    </article>
  );
}
