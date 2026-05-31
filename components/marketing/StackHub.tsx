import { ClaudeStar } from '../illustration/ClaudeStar';
import { Lampadina } from '../illustration/Lampadina';

interface Tool {
  name: string;
  short: string;   // monogram fallback if no logo
  color: string;   // brand-color background for the monogram tile
  fg?: string;
  /** Optional logo file under /public/logos/ (SVG preferred). */
  logo?: string;
}

// Symbol-only logomarks (no wordmarks/vertical lockups) for a cleaner look
// at chip size. Wordmark brands previously shown here (Lefebvre Giuffrè,
// Top24, DocuSign, Lexroom) were removed along with their SVGs.
const tools: Tool[] = [
  { name: 'ChatGPT',         short: 'GP', color: '#10a37f', logo: '/logos/chatgpt.svg' },
  { name: 'Notion',          short: 'N',  color: '#0f0f0f', logo: '/logos/notion.svg' },
  { name: 'Wolters Kluwer',  short: 'WK', color: '#007bc6', logo: '/logos/wolters-kluwer.svg' },
  { name: 'Grammarly',       short: 'G',  color: '#15c39a', logo: '/logos/grammarly.svg' },
];

// Manual workflows the lawyer does today, no paid tool involved.
// Stylistically distinct from the brand chips (dashed border, no logo)
// so the contrast reads: paid tools on one axis, manual labor on the other,
// both consolidated into Claude.
const manuals: { label: string; emoji: string }[] = [
  { label: 'Drafting manuale',      emoji: '✍︎' },
  { label: 'Ricerca giurisprudenziale', emoji: '⚖' },
  { label: 'Email controparte',     emoji: '✉' },
  { label: 'Sintesi atti',          emoji: '☰' },
];

function ToolChip({ tool }: { tool: Tool }) {
  return (
    <div className="bg-[#2e2922] border border-[#3a342c] rounded-md pl-1 pr-3 py-1 text-xs text-muted font-semibold flex items-center gap-2 shadow-lg whitespace-nowrap relative z-10">
      {tool.logo ? (
        <span
          className="w-8 h-8 rounded bg-white flex items-center justify-center p-1 shrink-0 ring-1 ring-black/5"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tool.logo} alt="" className="max-w-full max-h-full object-contain" />
        </span>
      ) : (
        <span
          className="w-8 h-8 rounded flex items-center justify-center text-[11px] font-bold tracking-tight shrink-0"
          style={{ backgroundColor: tool.color, color: tool.fg ?? '#fff' }}
          aria-hidden
        >
          {tool.short}
        </span>
      )}
      <span className="line-through text-[#7a6e60]">{tool.name}</span>
      <span className="bg-terracotta text-white text-[8px] px-1 py-0.5 rounded uppercase tracking-wider font-bold">−1</span>
    </div>
  );
}

function ManualChip({ label, emoji }: { label: string; emoji: string }) {
  return (
    <div className="bg-transparent border border-dashed border-[#4a4035] rounded-md pl-2 pr-3 py-1.5 text-xs text-muted font-medium italic flex items-center gap-2 whitespace-nowrap relative z-10">
      <span className="w-6 h-6 rounded bg-[#2e2922] text-terracotta-soft flex items-center justify-center text-[12px] shrink-0" aria-hidden>
        {emoji}
      </span>
      <span className="line-through text-[#7a6e60] non-italic">{label}</span>
      <span className="bg-terracotta text-white text-[8px] px-1 py-0.5 rounded uppercase tracking-wider font-bold not-italic">−1h</span>
    </div>
  );
}

/**
 * Animated SVG overlay that draws curved "energy" lines from each of the 8
 * surrounding cells into the central hub. Counterclockwise bend for every
 * curve gives the composition a unified swirl. `pointer-events-none` so
 * chips above stay clickable.
 *
 * viewBox uses percentages of the grid area, so the curves stay anchored
 * to the grid cells regardless of viewport width.
 */
function SpiralFlow() {
  // Each path: starts at the chip cell center, curves via a control point
  // that pulls counterclockwise, ends at the hub center (50,50).
  const paths: { d: string; delay: string }[] = [
    // Top row
    { d: 'M 16 16 Q 45 8 50 50',  delay: '0s'    }, // TL: ChatGPT
    { d: 'M 50 14 Q 32 30 50 50', delay: '0.15s' }, // TM: Drafting
    { d: 'M 84 16 Q 92 45 50 50', delay: '0.3s'  }, // TR: Notion
    // Middle row
    { d: 'M 14 50 Q 30 68 50 50', delay: '0.45s' }, // ML: Ricerca
    { d: 'M 86 50 Q 70 32 50 50', delay: '0.6s'  }, // MR: Email
    // Bottom row
    { d: 'M 16 84 Q 8 55 50 50',  delay: '0.75s' }, // BL: Wolters Kluwer
    { d: 'M 50 86 Q 68 70 50 50', delay: '0.9s'  }, // BM: Sintesi
    { d: 'M 84 84 Q 55 92 50 50', delay: '1.05s' }, // BR: Grammarly
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        {/* Each line fades from low-opacity at the chip end to brighter at the hub */}
        <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="rgba(217,119,87,0.55)" />
          <stop offset="60%" stopColor="rgba(217,119,87,0.18)" />
          <stop offset="100%" stopColor="rgba(217,119,87,0)"   />
        </radialGradient>
      </defs>

      {/* Faint static glow behind everything so the convergence point reads even before
          the dashes animate in. */}
      <circle cx="50" cy="50" r="40" fill="url(#hub-glow)" />

      {/* The 8 flowing dashed curves */}
      <g
        fill="none"
        stroke="#d97757"
        strokeOpacity="0.7"
        strokeWidth="0.35"
        strokeLinecap="round"
        strokeDasharray="0.6 2.4"
      >
        {paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            className="anim-spiral-flow"
            style={{ animationDelay: p.delay }}
          />
        ))}
      </g>
    </svg>
  );
}

export function StackHub() {
  const hub = (
    <div
      className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-terracotta flex items-center justify-center relative bg-[radial-gradient(circle,#2e2922_0%,#1a1714_70%)] shrink-0 z-10"
      style={{ boxShadow: '0 0 60px rgba(217,119,87,0.3), inset 0 0 30px rgba(217,119,87,0.15)' }}
    >
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 anim-bulb">
        <Lampadina size={38} />
      </div>
      <ClaudeStar size={72} className="sm:hidden" />
      <ClaudeStar size={90} className="hidden sm:block" />
      <span className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-terracotta-soft uppercase tracking-widest font-bold">Claude</span>
    </div>
  );

  return (
    <section id="stack" className="bg-ink text-cream pt-14 pb-16 sm:pt-20 sm:pb-20 px-5 sm:px-8 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <div className="text-[10px] uppercase tracking-widest text-terracotta-soft font-bold">Il problema · Lo stack legale frammentato</div>
          <h2 className="text-cream font-serif text-2xl sm:text-3xl font-bold mt-2 mb-3 leading-tight">Tanti strumenti, tanti abbonamenti, zero coordinazione.</h2>
          <p className="text-muted text-sm max-w-xl mx-auto">Banche dati, contract automation, gestionali, mail, ore di drafting a mano. Per ognuno c&apos;è una capacità di Claude che lo consolida. <strong className="text-cream">Il corso ti insegna esattamente come farlo</strong>, senza rompere il flusso di lavoro.</p>
        </div>

        {/* MOBILE: hub on top, then all 8 chips (4 brands + 4 manuals) stacked.
            Single column below sm (long manual labels overflow a half-viewport
            with whitespace-nowrap), two columns from sm up to md. */}
        <div className="md:hidden flex flex-col items-center gap-8">
          {hub}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mt-2">
            {tools.map((t) => <ToolChip key={t.name} tool={t} />)}
            {manuals.map((m) => <ManualChip key={m.label} label={m.label} emoji={m.emoji} />)}
          </div>
        </div>

        {/* DESKTOP: 3x3 grid with hub at center.
            Corners = brand tools (paid subscriptions).
            Edge midpoints = manual workflows (hours of human labor).
            SpiralFlow overlay draws animated curves from every cell into the hub. */}
        <div className="hidden md:grid grid-cols-3 gap-x-6 gap-y-10 items-center justify-items-center max-w-3xl mx-auto min-h-[460px] relative">
          <SpiralFlow />

          <ToolChip tool={tools[0]} />           {/* TL */}
          <ManualChip {...manuals[0]} />         {/* TM */}
          <ToolChip tool={tools[1]} />           {/* TR */}

          <ManualChip {...manuals[1]} />         {/* ML */}
          {hub}
          <ManualChip {...manuals[2]} />         {/* MR */}

          <ToolChip tool={tools[2]} />           {/* BL */}
          <ManualChip {...manuals[3]} />         {/* BM */}
          <ToolChip tool={tools[3]} />           {/* BR */}
        </div>
      </div>
    </section>
  );
}
