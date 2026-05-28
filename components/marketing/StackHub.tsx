import { ClaudeStar } from '../illustration/ClaudeStar';
import { Lampadina } from '../illustration/Lampadina';

// 8 tools arranged around the central hub in a 3x3 grid.
// Grid position is (col, row), index 4 (center) is reserved for the hub.
//
// Each chip carries a monogram tile in the tool's well-known brand color
// (nominative use, descriptive context — Claude consolidates these). We do
// NOT reproduce trademarked logo artwork; we use brand-color + initials,
// which keeps the styling uniform with the rest of the dark/terracotta page.
interface Tool {
  name: string;
  short: string;   // 1-2 letter monogram for the tile (fallback when no logo)
  color: string;   // brand-evocative background for the monogram tile
  fg?: string;     // override foreground when bg is light (e.g. DocuSign yellow)
  /**
   * Optional path to a real brand-logo image dropped into /public/logos/.
   * When present, the chip renders the image instead of the monogram tile.
   * Use SVG when possible. Recommended size: at least 64×64 transparent PNG/SVG.
   */
  logo?: string;
}

// To upgrade a chip from monogram to real logo:
//   1. Download the official press-kit logo from the brand's own site
//      (e.g. openai.com/brand, docusign.com/company/press-room).
//   2. Save it as /public/logos/<name>.svg (or .png).
//   3. Add `logo: '/logos/<name>.svg'` to the entry below.
// The fallback monogram + brand color stays in place if `logo` is missing.
const tools: Tool[] = [
  { name: 'Lefebvre Giuffrè', short: 'LG', color: '#1d1d1b', logo: '/logos/lefebvre-giuffre.svg' },
  { name: 'Wolters Kluwer',  short: 'WK', color: '#007bc6', logo: '/logos/wolters-kluwer.svg' },
  { name: 'Top24',           short: '24', color: '#1a1714', logo: '/logos/top24.svg' },
  { name: 'ChatGPT',         short: 'GP', color: '#10a37f', logo: '/logos/chatgpt.svg' },
  { name: 'DocuSign',        short: 'DS', color: '#ffcc00', fg: '#1a1714', logo: '/logos/docusign.svg' },
  { name: 'Lexroom',         short: 'LR', color: '#1a1714', logo: '/logos/lexroom.svg' },
  { name: 'Notion',          short: 'N',  color: '#0f0f0f', logo: '/logos/notion.svg' },
  { name: 'Grammarly',       short: 'G',  color: '#15c39a', logo: '/logos/grammarly.svg' },
];

function ToolChip({ tool }: { tool: Tool }) {
  return (
    <div className="bg-[#2e2922] border border-[#3a342c] rounded-md pl-1 pr-3 py-1 text-xs text-muted font-semibold flex items-center gap-2 shadow-lg whitespace-nowrap">
      {tool.logo ? (
        <span
          className="w-8 h-8 rounded bg-white flex items-center justify-center p-1 shrink-0 ring-1 ring-black/5"
          aria-hidden
        >
          {/* Plain <img> rather than next/image: keeps SSR simple and works with
              both SVG and PNG drops at /public/logos/. */}
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

export function StackHub() {
  const hub = (
    <div
      className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-terracotta flex items-center justify-center relative bg-[radial-gradient(circle,#2e2922_0%,#1a1714_70%)] shrink-0"
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
          <h2 className="text-cream font-serif text-2xl sm:text-3xl font-bold mt-2 mb-3 leading-tight">Otto strumenti, otto abbonamenti, zero coordinamento.</h2>
          <p className="text-muted text-sm max-w-xl mx-auto">Banche dati, contract automation, gestionali, mail. Per ogni strumento del tuo studio c&apos;è una capacità di Claude che lo consolida. <strong className="text-cream">Il corso ti insegna esattamente come farlo</strong>, senza rompere il flusso di lavoro.</p>
        </div>

        {/* MOBILE layout: hub on top, chips stacked in 2 columns below */}
        <div className="md:hidden flex flex-col items-center gap-8">
          {hub}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-2">
            {tools.map((t) => <ToolChip key={t.name} tool={t} />)}
          </div>
        </div>

        {/* DESKTOP layout: 3×3 grid with hub in the center cell */}
        <div className="hidden md:grid grid-cols-3 gap-6 items-center justify-items-center max-w-3xl mx-auto min-h-[420px]">
          <ToolChip tool={tools[0]} />
          <ToolChip tool={tools[1]} />
          <ToolChip tool={tools[2]} />

          <ToolChip tool={tools[3]} />
          {hub}
          <ToolChip tool={tools[4]} />

          <ToolChip tool={tools[5]} />
          <ToolChip tool={tools[6]} />
          <ToolChip tool={tools[7]} />
        </div>
      </div>
    </section>
  );
}
