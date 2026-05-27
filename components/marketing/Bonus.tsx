type PreviewKind = 'stack' | 'files' | 'folder' | 'pdf';

interface BonusItem {
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
  val: string;
  preview: PreviewKind;
}

const bonuses: BonusItem[] = [
  {
    tag: 'Bonus 01',
    title: '30 prompt-template italiani pronti',
    desc: 'Una libreria categorizzata di prompt collaudati, scritti in italiano forense. Apri, copia, adatta i campi tra parentesi quadre.',
    bullets: [
      'Atti: messa in mora, diffida, parere strutturato',
      'Contratti: revisione clausola per clausola, red flag',
      'Cliente: email di aggiornamento, preventivo, sollecito',
    ],
    val: '€197',
    preview: 'stack',
  },
  {
    tag: 'Bonus 02',
    title: '5 Skills installabili su Claude',
    desc: 'Comportamenti permanenti che configuri una volta e Claude richiama da solo quando serve. Niente da ricordare.',
    bullets: [
      'messa-in-mora · sintesi-sentenza · revisione-contratto',
      'email-controparte · parere-strutturato',
      'File SKILL.md commentati, pronti da personalizzare sul tuo studio',
    ],
    val: '€297',
    preview: 'files',
  },
  {
    tag: 'Bonus 03',
    title: 'Kit compliance per lo studio',
    desc: 'I documenti che il tuo DPO ti chiederà la prima volta che dirai "usiamo Claude". Già scritti, già impaginati.',
    bullets: [
      'STUDIO-AI-POLICY.md (policy interna firmabile)',
      'Registro trattamenti AI conforme GDPR art. 30',
      'Informativa cliente per uso AI nello studio',
    ],
    val: '€247',
    preview: 'folder',
  },
  {
    tag: 'Bonus 04',
    title: 'Aggiornamenti a vita + community',
    desc: 'Claude evolve in fretta. Tu non resti indietro: ricevi le nuove lezioni quando escono e parli con altri avvocati che lo usano davvero.',
    bullets: [
      'Tutte le future lezioni e Skills aggiunte al corso',
      'Accesso al canale privato (Telegram) di iscritti',
      'Q&A mensile su casi reali con il docente',
    ],
    val: '€197/anno',
    preview: 'pdf',
  },
];

function Preview({ kind }: { kind: PreviewKind }) {
  switch (kind) {
    case 'stack':
      return (
        <div className="h-24 relative bg-gradient-to-br from-cream-panel to-cream">
          <div className="absolute left-2.5 top-2.5 w-[70px] h-[18px] bg-white border border-[#d4cdbf] rounded-sm shadow -rotate-3" />
          <div className="absolute left-7 top-7 w-[70px] h-[18px] bg-white border border-[#d4cdbf] rounded-sm shadow" />
          <div className="absolute left-[50px] top-[46px] w-[70px] h-[18px] bg-terracotta rounded-sm shadow rotate-3" />
        </div>
      );
    case 'files':
      return (
        <div className="h-24 bg-gradient-to-br from-ink to-[#2e2922] flex gap-1 justify-center items-center">
          {['parere', 'revisione', 'email'].map((t, i) => (
            <div key={t} className={`w-[40px] h-[50px] bg-[#2e2922] border border-terracotta rounded-sm p-1.5 font-mono text-[6px] text-terracotta-soft text-left ${i === 1 ? '-translate-y-1' : ''}`}>
              SKILL.md<br /><br />{t}
            </div>
          ))}
        </div>
      );
    case 'folder':
      return (
        <div className="h-24 bg-gradient-to-br from-[#fef5ee] to-[#f9efe7] flex items-center justify-center">
          <div className="relative w-[100px] h-[60px]">
            <div className="absolute top-2 left-2.5 w-20 h-[50px] bg-terracotta rounded-r-md rounded-b-md">
              <div className="absolute -top-1.5 left-0 w-[30px] h-2 bg-terracotta rounded-t-md" />
              <span className="absolute top-4 left-5 text-[9px] text-white font-bold">Policy</span>
            </div>
          </div>
        </div>
      );
    case 'pdf':
      return (
        <div className="h-24 bg-gradient-to-br from-white to-cream-panel flex items-center justify-center">
          <div className="relative w-[60px] h-[70px] bg-white border border-[#d4cdbf] rounded-sm p-2">
            {[80, 60, 80, 60, 80, 60].map((w, i) => (
              <div key={i} className="h-0.5 bg-[#d4cdbf] mb-1 rounded-sm" style={{ width: `${w}%` }} />
            ))}
            <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-terracotta rounded-full flex items-center justify-center text-white text-[11px] font-bold">✦</div>
          </div>
        </div>
      );
  }
}

export function Bonus() {
  return (
    <section className="py-20 px-8 bg-gradient-to-b from-cream to-cream-panel">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-9">
          <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold">Inclusi nell&apos;iscrizione</div>
          <h2 className="font-serif text-3xl font-bold mt-2 mb-3">Quattro bonus che valgono il corso da soli.</h2>
          <p className="text-sm text-muted max-w-lg mx-auto">
            Non sono PDF gonfiati per fare numero. Sono i materiali che useresti il lunedì mattina, già pronti.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {bonuses.map(b => (
            <div key={b.tag} className="bg-white border border-line rounded-xl overflow-hidden relative shadow-md hover:-translate-y-1 transition-transform duration-200 ease-out will-change-transform">
              <span className="absolute top-2.5 right-2.5 bg-terracotta/95 text-white px-2 py-0.5 text-[7.5px] rounded uppercase tracking-widest font-bold z-10">{b.tag}</span>
              <Preview kind={b.preview} />
              <div className="p-4.5">
                <h4 className="font-serif text-sm font-bold mb-1.5">{b.title}</h4>
                <p className="text-[11px] text-muted leading-snug mb-2.5">{b.desc}</p>
                <ul className="space-y-1 mb-3">
                  {b.bullets.map(line => (
                    <li key={line} className="text-[10.5px] text-body leading-snug flex gap-1.5 items-start">
                      <span className="text-terracotta font-bold shrink-0">✓</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-[10px] text-terracotta font-bold pt-2.5 border-t border-line">VALORE {b.val}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[11px] text-muted mt-6">
          Valore totale dei bonus: <span className="font-bold text-terracotta">€938</span> · inclusi nel piano Avvocato a €79.
        </p>
      </div>
    </section>
  );
}
