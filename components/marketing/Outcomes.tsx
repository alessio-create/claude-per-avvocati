import { ClaudeMascot } from '../illustration/ClaudeMascot';

type Theme = 'pen' | 'folder' | 'code' | 'shield' | 'blocks' | 'balance';

interface OutcomeItem {
  theme: Theme;
  variant: 'astro' | 'happy' | 'mid';
  tint: string;    // background tint of the mascot well
  accent: string;   // left border accent on the card
  title: string;
  sub: string;
}

const items: OutcomeItem[] = [
  { theme: 'pen',   variant: 'happy', tint: '#fef5ee', accent: '#d97757', title: 'Drafare un parere in 1/3 del tempo', sub: 'Senza compromettere qualità.' },
  { theme: 'folder', variant: 'mid',  tint: '#fdf4e7', accent: '#cc8a73', title: 'Setup Projects per ogni cliente',  sub: 'Contesto persistente, niente copy-paste.' },
  { theme: 'code',  variant: 'astro', tint: '#f3ede0', accent: '#1a1714', title: 'Claude Code per documenti massivi', sub: 'Cento contratti, una skill.' },
  { theme: 'shield', variant: 'happy', tint: '#f0ebda', accent: '#6fa28b', title: 'Cosa puoi inviare a Claude',     sub: 'GDPR, deontologia, segreto.' },
  { theme: 'blocks', variant: 'astro', tint: '#fceede', accent: '#d97757', title: 'Skills personalizzate per studio',  sub: 'Stile riusabile.' },
  { theme: 'balance', variant: 'mid',  tint: '#f5e7d8', accent: '#c4623f', title: 'Quale piano Claude scegliere',    sub: 'Free vs Pro vs Max vs Team.' },
];

function Accessory({ theme }: { theme: Theme }) {
  const common = { width: 16, height: 16, viewBox: '0 0 16 16', 'aria-hidden': true as const };
  switch (theme) {
    case 'pen':
      return (
        <svg {...common}>
          <path d="M2 14 L4 12 L11 5 L13 7 L6 14 Z" fill="#d97757" />
          <path d="M11 5 L12 4 L13 5 L12 6 Z" fill="#1a1714" />
          <line x1="2" y1="14" x2="6" y2="14" stroke="#1a1714" strokeWidth="1" />
        </svg>
      );
    case 'folder':
      return (
        <svg {...common}>
          <path d="M1 4 L6 4 L7 5 L15 5 L15 13 L1 13 Z" fill="#d97757" stroke="#1a1714" strokeWidth="0.8" />
          <line x1="3" y1="8" x2="13" y2="8" stroke="#1a1714" strokeWidth="0.6" opacity="0.5" />
        </svg>
      );
    case 'code':
      return (
        <svg {...common}>
          <path d="M5 4 L1 8 L5 12" fill="none" stroke="#d97757" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 4 L15 8 L11 12" fill="none" stroke="#d97757" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="9" y1="3" x2="7" y2="13" stroke="#1a1714" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M8 1 L14 3 L14 8 Q14 12 8 15 Q2 12 2 8 L2 3 Z" fill="#d97757" stroke="#1a1714" strokeWidth="0.8" />
          <path d="M5 8 L7 10 L11 6" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'blocks':
      return (
        <svg {...common}>
          <rect x="1" y="1" width="6" height="6" rx="1" fill="#d97757" />
          <rect x="9" y="1" width="6" height="6" rx="1" fill="none" stroke="#1a1714" strokeWidth="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" fill="none" stroke="#1a1714" strokeWidth="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" fill="#d97757" />
        </svg>
      );
    case 'balance':
      return (
        <svg {...common}>
          <line x1="8" y1="2" x2="8" y2="14" stroke="#1a1714" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="2" y1="5" x2="14" y2="5" stroke="#1a1714" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M2 5 L0 9 L4 9 Z" fill="#d97757" />
          <path d="M14 5 L12 9 L16 9 Z" fill="#d97757" />
          <rect x="6" y="13" width="4" height="1.5" fill="#1a1714" />
        </svg>
      );
  }
}

export function Outcomes() {
  return (
    <section className="py-20 px-8 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-[200px_1fr] gap-10 items-center mb-11">
        <div className="aspect-square bg-gradient-to-br from-[#fef5ee] to-[#f9efe7] rounded-2xl border border-line shadow-md flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(217,119,87,0.15), transparent 60%)' }} />
          <div className="relative z-10 anim-float"><ClaudeMascot variant="happy" size={100} /></div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold">Il risultato · Quello che il corso ti porta a casa</div>
          <h2 className="font-serif text-3xl font-bold leading-tight mt-2 mb-3">Sei capacità nuove, lunedì mattina.</h2>
          <p className="text-sm text-body leading-relaxed">Sei competenze concrete, ognuna costruita da uno o più moduli specifici. Non promesse: cose che usi sulla pratica del tuo studio già dalla prima settimana dopo il corso.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it, i) => (
          <div
            key={i}
            className="bg-white border border-line rounded-lg p-4.5 flex gap-3.5 items-start hover:-translate-y-0.5 hover:shadow-md transition-all shadow-sm border-l-4"
            style={{ borderLeftColor: it.accent }}
          >
            <div
              className="w-11 h-11 shrink-0 rounded-md flex items-center justify-center relative"
              style={{ background: it.tint }}
            >
              <ClaudeMascot variant={it.variant} size={32} />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-line">
                <Accessory theme={it.theme} />
              </div>
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs leading-tight mb-1">{it.title}</h4>
              <p className="text-[10.5px] text-muted leading-snug">{it.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
