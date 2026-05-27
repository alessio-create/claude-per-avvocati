import Link from 'next/link';
import { getCorsoIndex } from '../../lib/content';
import { ClaudeStar } from '../../components/illustration/ClaudeStar';
import { EsameBadge } from '../../components/course/EsameBadge';
import { ModuleCard } from '../../components/course/ModuleCard';
import { PioneerCelebration } from '../../components/course/PioneerCelebration';
import { UpsellBanner } from '../../components/course/UpsellBanner';

export default function CorsoHome() {
    const index = getCorsoIndex();
    const core = index.moduli.filter((m) => !m.bonus);
    const bonus = index.moduli.filter((m) => m.bonus);
    const firstCore = core[0];

    return (
        <div>
            <div className="text-xs uppercase tracking-widest text-terracotta font-bold mb-2">Corso</div>
            <h1 className="font-serif text-4xl font-bold mb-3">Claude per Avvocati</h1>
            <p className="text-muted text-base leading-snug mb-10 max-w-2xl">
                {core.length} moduli core + {bonus.length} moduli bonus per padroneggiare Claude nel tuo studio.
                Inizia dal primo modulo o, se hai già esperienza, fai il test di livello per partire più avanti.
            </p>

            {/* Pioneer reward: renders only when the user has finished all core + cert. */}
            <PioneerCelebration index={index} />

            {/* Upsell for free / anonymous users. Hidden for paid tiers. */}
            <UpsellBanner />

            {/* Primary hero cards: start from M1 / placement test. Both terracotta-bordered
                for equal visual weight. Test di livello carries an extra "Consigliato"
                ribbon to make it discoverable for users with prior experience. */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {firstCore && (
                    <Link
                        href={`/corso/${firstCore.slug}/${firstCore.lezioni[0]?.slug ?? ''}`}
                        className="group block rounded-xl border-2 border-terracotta bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-2">Percorso consigliato</div>
                        <h2 className="font-serif text-2xl font-bold mb-2 group-hover:text-terracotta transition-colors">
                            Inizia da zero
                        </h2>
                        <p className="text-sm text-muted leading-snug mb-4">
                            Parti dal Modulo 1, {firstCore.titolo.replace(/^.*?— /, '')}. Aperto a tutti, niente prerequisiti.
                        </p>
                        <div className="text-terracotta font-semibold text-sm">
                            → Apri il primo modulo
                        </div>
                    </Link>
                )}

                <Link
                    href="/corso/placement-test"
                    className="group relative block rounded-xl border-2 border-terracotta bg-gradient-to-br from-white to-[#fff4ec] p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                    <span className="absolute -top-2.5 right-4 bg-terracotta text-white px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-bold shadow">
                        Se hai esperienza
                    </span>
                    <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-2">Salta avanti</div>
                    <h2 className="font-serif text-2xl font-bold mb-2 group-hover:text-terracotta transition-colors">
                        Test di livello
                    </h2>
                    <p className="text-sm text-muted leading-snug mb-4">
                        5 domande rapide per capire dove iniziare. Se vai bene, saltiamo direttamente al modulo 2 o 3.
                    </p>
                    <div className="text-terracotta font-semibold text-sm">
                        → Fai il test (3 minuti)
                    </div>
                </Link>
            </div>

            {/* Secondary quick-access cards: glossary + 30-day plan. Smaller weight
                than the two hero CTAs above but still surfaced on the landing. */}
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
                <Link
                    href="/corso/glossario"
                    className="group flex items-center gap-4 rounded-lg border border-line bg-white p-4 hover:border-terracotta hover:shadow-sm transition-all"
                >
                    <div className="shrink-0 w-12 h-12 rounded-md bg-cream-panel flex items-center justify-center font-serif font-bold text-terracotta text-lg">
                        30
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-0.5">
                            Riferimento veloce
                        </div>
                        <h3 className="font-serif font-bold text-sm leading-tight mb-0.5 group-hover:text-terracotta transition-colors">
                            Glossario
                        </h3>
                        <p className="text-[11px] text-muted leading-snug m-0">
                            30 termini con definizioni pratiche
                        </p>
                    </div>
                    <span className="text-terracotta text-sm font-bold shrink-0">→</span>
                </Link>

                <Link
                    href="/corso/30-giorni"
                    className="group flex items-center gap-4 rounded-lg border border-line bg-white p-4 hover:border-terracotta hover:shadow-sm transition-all"
                >
                    <div className="shrink-0 w-12 h-12 rounded-md bg-cream-panel flex items-center justify-center font-serif font-bold text-terracotta text-lg">
                        ✦
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-0.5">
                            Piano pratico
                        </div>
                        <h3 className="font-serif font-bold text-sm leading-tight mb-0.5 group-hover:text-terracotta transition-colors">
                            30 giorni
                        </h3>
                        <p className="text-[11px] text-muted leading-snug m-0">
                            Un&apos;azione concreta al giorno
                        </p>
                    </div>
                    <span className="text-terracotta text-sm font-bold shrink-0">→</span>
                </Link>
            </div>

            {/* Core modules */}
            <section className="mb-12">
                <div className="flex items-baseline justify-between mb-5">
                    <h3 className="font-serif text-xl font-bold">Moduli principali</h3>
                    <span className="text-xs text-muted">Solo il Modulo 1 è aperto. Gli altri si sbloccano completando il precedente.</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {core.map((m) => <ModuleCard key={m.slug} m={m} />)}
                </div>
            </section>

            {/* Bonus modules */}
            <section className="mb-12">
                <h3 className="font-serif text-xl font-bold mb-3">Moduli bonus</h3>

                {/* Lock-mechanism explainer banner: makes the gem-gating unmistakable */}
                <div className="rounded-xl border-2 border-dashed border-terracotta/50 bg-gradient-to-br from-[#fff7f1] to-cream-panel p-5 mb-6">
                    <div className="flex items-start gap-4 flex-wrap">
                        <div className="shrink-0 w-12 h-12 rounded-md bg-terracotta/15 flex items-center justify-center">
                            <span className="font-serif text-2xl font-bold text-terracotta">✦</span>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">
                                Bloccati per chi è sul piano gratis o Avvocato
                            </div>
                            <p className="text-sm text-body leading-snug m-0">
                                I 4 moduli bonus restano <strong>bloccati</strong> fino a quando non spendi le gemme guadagnate
                                (leggendo le lezioni e superando gli esami), <strong>oppure</strong> passi al piano Studio (€149)
                                che li include tutti pre-sbloccati.
                            </p>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 mt-4">
                        <div className="rounded-md bg-white border border-line p-3">
                            <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">Opzione 1 · Spendi gemme</div>
                            <p className="text-xs text-muted leading-snug m-0">
                                Guadagni 1 ✦ per lezione, 3 ✦ per quiz, 10 ✦ per modulo completato. Ogni bonus costa 30-50 ✦.
                            </p>
                        </div>
                        <div className="rounded-md bg-white border border-line p-3">
                            <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">Opzione 2 · Piano Studio</div>
                            <p className="text-xs text-muted leading-snug m-0">
                                Tutti i 4 bonus inclusi senza gemme. Per studi 3+ persone. <Link href="/#prezzi" className="text-terracotta font-semibold hover:underline">Vedi i piani →</Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {bonus.map((m) => <ModuleCard key={m.slug} m={m} bonus />)}
                </div>
            </section>

            {/* Certificate CTA */}
            <section className="mb-8">
                <Link
                    href="/corso/certificazione"
                    className="block rounded-xl border-2 border-terracotta bg-gradient-to-br from-white to-cream-panel p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="shrink-0">
                            <ClaudeStar size={48} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1 flex items-center gap-1.5">
                                <EsameBadge size={11} /> Prova finale
                            </div>
                            <h3 className="font-serif text-xl font-bold mb-1">Certificazione Claude per Avvocati</h3>
                            <p className="text-sm text-muted leading-snug m-0">
                                9 domande, una per modulo. Pass 7/9 → certificato + 50 ✦ + condivisione su LinkedIn.
                            </p>
                        </div>
                        <div className="text-terracotta font-bold text-sm shrink-0">→</div>
                    </div>
                </Link>
            </section>
        </div>
    );
}
