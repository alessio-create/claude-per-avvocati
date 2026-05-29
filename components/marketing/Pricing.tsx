interface Tier {
  name: string;
  tag: string;
  price: string;
  priceNote: string;
  href: string;
  featured?: boolean;
  free?: boolean;
  features: { label: string; active: boolean }[];
  cert?: { title: string; sub: string };
  cta: string;
}

const tiers: Tier[] = [
  {
    name: 'Praticante',
    tag: 'Per capire se fa per te',
    price: '€0',
    priceNote: 'per sempre · serve solo la email',
    href: '/iscriviti-gratis',
    free: true,
    cta: 'Inizia col Modulo 1 gratis',
    features: [
      { label: 'Modulo 1 intero: 5 lezioni più esame', active: true },
      { label: 'Progressi salvati, riprendi quando vuoi', active: true },
      { label: 'Gemme per sbloccare moduli bonus', active: true },
      { label: 'Nuove lezioni gratis quando escono', active: true },
      { label: 'Moduli 2-6, il percorso completo', active: false },
      { label: 'Certificato finale, condivisibile su LinkedIn', active: false },
      { label: 'Fattura intestata allo studio', active: false },
      { label: 'Rimborso entro 14 giorni', active: false },
    ],
  },
  {
    name: 'Avvocato',
    tag: 'Per chi lavora da solo',
    price: '€79',
    priceNote: 'una tantum · IVA inclusa',
    href: '/checkout?tier=avvocato',
    featured: true,
    cta: 'Iscriviti, €79',
    cert: { title: 'Certificato finale con punteggio', sub: 'pronto da pubblicare su LinkedIn in un click' },
    features: [
      { label: 'Tutto quello che hai in Praticante', active: true },
      { label: '6 moduli completi, ognuno con esame', active: true },
      { label: 'Scegli 1 modulo bonus tra i quattro', active: true },
      { label: 'Certificato finale con share LinkedIn', active: true },
      { label: 'Fattura intestata allo studio', active: true },
      { label: 'Rimborso entro 14 giorni, nessuna domanda', active: true },
      { label: 'Aggiornamenti a vita, anche futuri moduli', active: true },
      { label: 'Accessi multipli e Q&A 1:1 con il team', active: false },
    ],
  },
  {
    name: 'Studio',
    tag: 'Fino a 5 avvocati, stessa licenza',
    price: '€149',
    priceNote: 'una tantum · IVA inclusa',
    href: '/checkout?tier=studio',
    cta: 'Iscrivi lo studio',
    cert: { title: 'Certificato nominativo per ogni avvocato', sub: 'formazione documentata per il fascicolo dello studio' },
    features: [
      { label: 'Tutto quello che hai in Avvocato', active: true },
      { label: '5 accessi nominativi, uno per collega', active: true },
      { label: 'Tutti e 4 i moduli bonus, già sbloccati', active: true },
      { label: 'Onboarding 1:1 con il team (30 minuti)', active: true },
      { label: 'Setup MCP per collegare il gestionale', active: true },
      { label: '2 prompt-template scritti sul tuo studio', active: true },
      { label: 'Skill di esempio pronta da scaricare', active: true },
      { label: 'Codici sconto da girare ai colleghi', active: true },
    ],
  },
];

export function Pricing() {
  return (
    <section id="prezzi" className="bg-[#0f0c0a] text-cream py-14 sm:py-20 px-5 sm:px-8 text-center relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(217,119,87,0.12), transparent 50%)' }} />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-[10px] uppercase tracking-widest text-terracotta-soft font-bold">Iscrizione</div>
        <h2 className="text-cream font-serif text-3xl sm:text-4xl font-bold mt-2 mb-3 leading-tight">Provi il primo modulo. Decidi dopo.</h2>
        <p className="text-muted text-sm max-w-md mx-auto mb-9">
          Modulo 1 gratis, senza carta e senza scadenza. Se ti convince, scegli il piano per te o per lo studio. Altrimenti, resti sul gratuito.
        </p>
        <div className="grid md:grid-cols-3 gap-8 md:gap-4 text-left items-stretch mt-12 md:mt-0">
          {tiers.map(t => (
            <div
              key={t.name}
              className={`rounded-xl p-6 flex flex-col transition-transform duration-200 ease-out hover:-translate-y-1 will-change-transform ${
                t.featured
                  ? 'bg-gradient-to-b from-cream to-cream-panel text-ink border-2 border-terracotta shadow-[0_20px_50px_rgba(217,119,87,0.25)]'
                  : t.free
                    ? 'bg-ink border-2 border-dashed border-[#3e342a] hover:border-terracotta'
                    : 'bg-ink border border-[#2e2922] hover:border-terracotta'
              }`}
            >
              {t.featured && (
                <span className="self-center -mt-9 mb-3 bg-terracotta text-white px-3 py-1 text-[9px] rounded uppercase tracking-wider font-bold whitespace-nowrap">
                  ⭐ Più scelto
                </span>
              )}
              {t.free && (
                <span className="self-center -mt-9 mb-3 bg-[#6fa28b] text-white px-3 py-1 text-[9px] rounded uppercase tracking-wider font-bold whitespace-nowrap">
                  ✓ Gratis · nessuna carta
                </span>
              )}
              <div className="font-serif text-sm font-bold mb-1.5">{t.name}</div>
              <div className={`text-[9.5px] uppercase tracking-wider font-semibold mb-4 ${t.featured ? 'text-terracotta' : 'text-muted'}`}>{t.tag}</div>
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="font-serif text-4xl font-bold">{t.price}</span>
                <span className="text-[9.5px] text-muted">{t.priceNote}</span>
              </div>
              {t.cert && (
                <div className={`rounded p-2.5 mb-3.5 flex gap-2 items-center text-[9.5px] font-semibold ${t.featured ? 'bg-white border border-dashed border-terracotta text-terracotta' : 'bg-[#2e2922] border border-dashed border-terracotta text-terracotta-soft'}`}>
                  <span className="w-5.5 h-5.5 rounded-full bg-terracotta flex items-center justify-center text-white text-xs shrink-0">✦</span>
                  <div>{t.cert.title}<br /><span className="opacity-70 font-medium">{t.cert.sub}</span></div>
                </div>
              )}
              <ul className="space-y-1 mb-4 flex-1">
                {t.features.map(f => (
                  <li key={f.label} className={`text-[10.5px] flex gap-1.5 items-start ${f.active ? (t.featured ? 'text-body' : 'text-muted') : (t.featured ? 'text-muted' : 'text-[#6b6055]')}`}>
                    <span className={`font-bold ${f.active ? 'text-terracotta' : 'text-[#463d33]'}`}>{f.active ? '✓' : '−'}</span>
                    {f.label}
                  </li>
                ))}
              </ul>
              <a
                href={t.href}
                className={`block text-center py-2.5 rounded text-xs font-bold ${
                  t.featured
                    ? 'bg-terracotta text-white'
                    : t.free
                      ? 'bg-[#6fa28b] text-white hover:bg-[#5d8a76]'
                      : 'bg-[#2e2922] text-cream'
                }`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="text-[9.5px] text-muted mt-6">
          Pagamento sicuro via Stripe · Fattura intestata allo studio · Rimborso entro 14 giorni · Per ordini tramite Ordine o fatturazione differita scrivi a <a href="mailto:fatture@claudeperavvocati.it" className="text-terracotta-soft hover:underline">fatture@claudeperavvocati.it</a>
        </p>
      </div>
    </section>
  );
}
