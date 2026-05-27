'use client';
import { useEffect, useState } from 'react';
import { ClaudeMascot } from '../illustration/ClaudeMascot';

/**
  * ClaudeScenes, cycling pixel-art scenes inspired by Anthropic's product art.
  *
  * Dark background with a dot-grid pattern; the Claude mascot sits in the
  * center, and a set of silhouette props (bookshelves, lamps, scales, etc.)
  * cycle around it to evoke different parts of an avvocato's day.
  *
  * Each scene is a flat SVG of small white rectangles, rendered at low opacity
  * so the dot-grid texture is visible through them. Pure CSS crossfade between
  * scenes, no JS animation framework.
  */

type SceneKey = 'biblioteca' | 'scrivania' | 'tribunale' | 'notte';

interface SceneDef {
  key: SceneKey;
  label: string;
  caption: string;
}

const SCENES: SceneDef[] = [
  {
    key: 'biblioteca',
    label: 'Modulo 4 · Ricerca giurisprudenziale',
    caption: 'Una sentenza letta e mappata in 3 minuti invece di 25. Insegnamo i prompt giusti.',
  },
  {
    key: 'scrivania',
    label: 'Modulo 4 · Drafting di pareri e atti',
    caption: 'Prime bozze in 5 minuti, da rifinire e firmare. Più clienti, stesso orario.',
  },
  {
    key: 'tribunale',
    label: 'Modulo 9 · App mobile in aula',
    caption: 'Foto di un\'ordinanza, sintesi prima dell\'arringa. Setup in 10 minuti.',
  },
  {
    key: 'notte',
    label: 'Modulo 5 · Skills che lavorano per te',
    caption: '30 minuti di setup = report automatici ogni lunedì. Ore recuperate alla settimana.',
  },
];

const ROTATION_MS = 5000;
const FADE_MS = 900;

export function ClaudeScenes() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % SCENES.length), ROTATION_MS);
    return () => clearInterval(id);
  }, []);

  const current = SCENES[i];

  return (
    <section className="relative bg-[#0a0807] text-cream py-12 px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold">Il corso, scena per scena</div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2 mb-2 text-cream">
            Quattro momenti del tuo studio. Quattro moduli del corso.
          </h2>
          <p className="text-sm text-muted max-w-xl mx-auto">
            Non insegniamo Claude in astratto. Insegniamo i workflow concreti che ti restituiscono ore
            fatturabili, e i prompt, le Skills e le configurazioni per replicarli ogni giorno.
          </p>
        </div>

        {/* The animated stage, smaller, more compact */}
        <div className="relative aspect-[2/1] rounded-xl border border-[#1f1a16] overflow-hidden shadow-2xl">
          {/* Dot grid base */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: '#0a0807',
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
              backgroundSize: '6px 6px',
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 35%, rgba(10,8,7,0.55) 75%, rgba(10,8,7,0.9) 100%)',
            }}
          />

          {/* Cycling scene props (crossfade) */}
          {SCENES.map((s, idx) => (
            <div
              key={s.key}
              className="absolute inset-0 transition-opacity ease-in-out"
              style={{
                opacity: idx === i ? 1 : 0,
                transitionDuration: `${FADE_MS}ms`,
              }}
              aria-hidden
            >
              <SceneArt scene={s.key} />
            </div>
          ))}

          {/* Claude in the foreground, terracotta on dark, always visible */}
          <div className="absolute inset-0 flex items-end justify-center pb-[20%]">
            <div className="anim-float drop-shadow-[0_0_18px_rgba(217,119,87,0.45)]">
              <ClaudeMascot variant="happy" size={96} />
            </div>
          </div>

          {/* Scene caption, bottom-left chip, fades with the scene */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
            <div
              key={current.key}
              className="inline-flex flex-col gap-0.5 bg-black/55 backdrop-blur-sm border border-[#1f1a16] rounded-md px-3 py-2 max-w-xs"
              style={{ animation: 'cpa-caption-fade 600ms ease-out' }}
            >
              <div className="text-[10px] uppercase tracking-widest text-terracotta-soft font-bold">
                {current.label}
              </div>
              <div className="text-[11px] text-muted leading-snug">{current.caption}</div>
            </div>
            <div className="flex gap-1.5">
              {SCENES.map((s, idx) => (
                <button
                  key={s.key}
                  type="button"
                  aria-label={`Mostra scena: ${s.label}`}
                  onClick={() => setI(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === i ? 'bg-terracotta w-5' : 'bg-muted/40 hover:bg-muted/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA: pulls back to the course offer */}
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap text-sm">
          <a
            href="/iscriviti-gratis"
            className="inline-flex items-center gap-2 bg-terracotta text-white font-bold px-5 py-2.5 rounded shadow hover:bg-terracotta/90 transition-colors"
          >
            Inizia col Modulo 1 gratis →
          </a>
          <a
            href="#prezzi"
            className="inline-flex items-center gap-2 text-terracotta-soft hover:text-cream font-semibold"
          >
            Vedi i piani · da €79
          </a>
        </div>
      </div>

      <style>{`
        @keyframes cpa-caption-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Scene props, flat SVG silhouettes drawn over the dot-grid background.  */
/* All rectangles are white at ~25-55% opacity; the underlying dot pattern */
/* shows through to give the dithered, low-fi pixel-art aesthetic.     */
/* -------------------------------------------------------------------------- */

function SceneArt({ scene }: { scene: SceneKey }) {
  return (
    <svg
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {scene === 'biblioteca' && <Biblioteca />}
      {scene === 'scrivania' && <Scrivania />}
      {scene === 'tribunale' && <Tribunale />}
      {scene === 'notte' && <Notte />}
    </svg>
  );
}

/** Helper: a column of "books" on a shelf, alternating heights/widths. */
function BookRow({ x, y, count = 10 }: { x: number; y: number; count?: number }) {
  const books: { dx: number; w: number; h: number; o: number }[] = [];
  let dx = 0;
  const seed = x + y;
  for (let k = 0; k < count; k++) {
    const w = 4 + ((seed + k * 7) % 5);
    const h = 8 + ((seed + k * 11) % 4);
    const o = 0.32 + ((seed + k * 13) % 5) * 0.05;
    books.push({ dx, w, h, o });
    dx += w + 1;
  }
  return (
    <g fill="#fff">
      {books.map((b, k) => (
        <rect key={k} x={x + b.dx} y={y + (12 - b.h)} width={b.w} height={b.h} opacity={b.o} />
      ))}
    </g>
  );
}

function Biblioteca() {
  return (
    <g>
      {/* Left bookcase frame */}
      <g fill="#fff" opacity="0.35">
        <rect x="14" y="28" width="78" height="2" />
        <rect x="14" y="56" width="78" height="2" />
        <rect x="14" y="84" width="78" height="2" />
        <rect x="14" y="112" width="78" height="2" />
        <rect x="14" y="28" width="2" height="86" />
        <rect x="90" y="28" width="2" height="86" />
      </g>
      {/* Shelves of books on the left */}
      <BookRow x={18} y={30} count={9} />
      <BookRow x={18} y={58} count={9} />
      <BookRow x={18} y={86} count={9} />

      {/* Right bookcase frame */}
      <g fill="#fff" opacity="0.35">
        <rect x="228" y="28" width="78" height="2" />
        <rect x="228" y="56" width="78" height="2" />
        <rect x="228" y="84" width="78" height="2" />
        <rect x="228" y="112" width="78" height="2" />
        <rect x="228" y="28" width="2" height="86" />
        <rect x="304" y="28" width="2" height="86" />
      </g>
      <BookRow x={232} y={30} count={9} />
      <BookRow x={232} y={58} count={9} />
      <BookRow x={232} y={86} count={9} />

      {/* Hanging lamp top center */}
      <g fill="#fff">
        <rect x="158" y="0" width="2" height="14" opacity="0.4" />
        <rect x="150" y="14" width="18" height="2" opacity="0.45" />
        <rect x="152" y="16" width="14" height="2" opacity="0.5" />
        <rect x="154" y="18" width="10" height="2" opacity="0.55" />
        {/* light cone */}
        <polygon points="159,20 132,46 186,46" fill="#fff" opacity="0.08" />
      </g>

      {/* Plant on top of right shelf */}
      <g fill="#fff" opacity="0.45">
        <rect x="266" y="20" width="6" height="6" />
        <rect x="262" y="14" width="4" height="6" />
        <rect x="270" y="12" width="4" height="8" />
        <rect x="274" y="16" width="4" height="6" />
        <rect x="268" y="10" width="4" height="4" />
      </g>

      {/* Floor line */}
      <rect x="0" y="148" width="320" height="2" fill="#fff" opacity="0.25" />
    </g>
  );
}

function Scrivania() {
  return (
    <g>
      {/* Window top-right with grid */}
      <g fill="#fff" opacity="0.35">
        <rect x="220" y="14" width="80" height="60" fillOpacity="0" stroke="#fff" strokeWidth="2" />
        <rect x="220" y="42" width="80" height="2" />
        <rect x="258" y="14" width="2" height="60" />
      </g>
      {/* "moonlight" through window */}
      <rect x="222" y="16" width="76" height="56" fill="#fff" opacity="0.06" />

      {/* Desk surface, wide flat band */}
      <g fill="#fff" opacity="0.4">
        <rect x="20" y="120" width="280" height="3" />
        {/* desk legs */}
        <rect x="36" y="123" width="3" height="32" />
        <rect x="281" y="123" width="3" height="32" />
      </g>

      {/* Desk lamp (left) */}
      <g fill="#fff">
        <rect x="60" y="106" width="2" height="14" opacity="0.45" />
        <rect x="54" y="100" width="14" height="6" opacity="0.5" />
        <polygon points="61,106 44,124 78,124" opacity="0.1" />
      </g>

      {/* Laptop / open book on the desk (center-right of mascot) */}
      <g fill="#fff" opacity="0.5">
        <rect x="180" y="110" width="46" height="10" />
        <rect x="180" y="120" width="46" height="2" opacity="0.7" />
        {/* screen content lines */}
        <rect x="184" y="112" width="22" height="1" opacity="0.6" />
        <rect x="184" y="115" width="32" height="1" opacity="0.5" />
        <rect x="184" y="118" width="18" height="1" opacity="0.55" />
      </g>

      {/* Stack of papers (left of mascot) */}
      <g fill="#fff" opacity="0.45">
        <rect x="90" y="116" width="30" height="6" />
        <rect x="92" y="113" width="28" height="3" opacity="0.6" />
        <rect x="94" y="110" width="26" height="3" opacity="0.7" />
      </g>

      {/* Coffee mug */}
      <g fill="#fff" opacity="0.55">
        <rect x="240" y="114" width="10" height="8" />
        <rect x="250" y="116" width="3" height="4" />
        <rect x="242" y="111" width="2" height="2" opacity="0.5" />
        <rect x="246" y="110" width="2" height="3" opacity="0.5" />
      </g>

      {/* Floor */}
      <rect x="0" y="156" width="320" height="2" fill="#fff" opacity="0.2" />
    </g>
  );
}

function Tribunale() {
  return (
    <g>
      {/* Two big columns left & right */}
      <g fill="#fff" opacity="0.4">
        {/* left column */}
        <rect x="30" y="18" width="18" height="6" />
        <rect x="34" y="24" width="10" height="120" />
        <rect x="28" y="144" width="22" height="6" />
        {/* right column */}
        <rect x="272" y="18" width="18" height="6" />
        <rect x="276" y="24" width="10" height="120" />
        <rect x="270" y="144" width="22" height="6" />
      </g>

      {/* Pediment / arch top */}
      <g fill="#fff" opacity="0.32">
        <polygon points="20,18 300,18 280,4 40,4" />
      </g>

      {/* Scales of justice top-center */}
      <g fill="#fff">
        {/* stand */}
        <rect x="158" y="30" width="4" height="50" opacity="0.6" />
        <rect x="146" y="80" width="28" height="3" opacity="0.6" />
        {/* arm */}
        <rect x="118" y="34" width="84" height="2" opacity="0.6" />
        {/* left pan */}
        <rect x="116" y="38" width="2" height="10" opacity="0.5" />
        <rect x="204" y="38" width="2" height="10" opacity="0.5" />
        <rect x="108" y="48" width="18" height="3" opacity="0.55" />
        <rect x="196" y="48" width="18" height="3" opacity="0.55" />
      </g>

      {/* Latin-style inscription dots (just shapes, abstract) */}
      <g fill="#fff" opacity="0.25">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
          <rect key={k} x={108 + k * 14} y={96} width={8} height={2} />
        ))}
      </g>

      {/* Floor checkerboard hint */}
      <g fill="#fff" opacity="0.18">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
          <rect key={k} x={k * 40} y={156} width={20} height={20} />
        ))}
      </g>
    </g>
  );
}

function Notte() {
  return (
    <g>
      {/* Big window left with moon */}
      <g fill="#fff" opacity="0.35">
        <rect x="18" y="14" width="90" height="80" fillOpacity="0" stroke="#fff" strokeWidth="2" />
        <rect x="18" y="52" width="90" height="2" />
        <rect x="62" y="14" width="2" height="80" />
      </g>
      {/* Moon */}
      <g fill="#fff" opacity="0.7">
        <rect x="36" y="28" width="14" height="2" />
        <rect x="32" y="30" width="22" height="2" />
        <rect x="30" y="32" width="26" height="6" />
        <rect x="32" y="38" width="22" height="2" />
        <rect x="36" y="40" width="14" height="2" />
        {/* moon shadow (crescent) */}
        <rect x="40" y="32" width="14" height="6" fill="#0a0807" opacity="0.8" />
      </g>
      {/* Stars */}
      <g fill="#fff" opacity="0.55">
        <rect x="80" y="20" width="2" height="2" />
        <rect x="98" y="32" width="2" height="2" />
        <rect x="88" y="44" width="2" height="2" />
        <rect x="72" y="36" width="2" height="2" />
      </g>

      {/* Stack of files (right of mascot) */}
      <g fill="#fff" opacity="0.5">
        <rect x="220" y="118" width="60" height="6" />
        <rect x="222" y="112" width="58" height="6" opacity="0.7" />
        <rect x="224" y="106" width="56" height="6" opacity="0.55" />
        <rect x="226" y="100" width="54" height="6" opacity="0.4" />
        {/* binder rings */}
        <rect x="234" y="98" width="2" height="2" />
        <rect x="250" y="98" width="2" height="2" />
        <rect x="266" y="98" width="2" height="2" />
      </g>

      {/* Desk lamp glow */}
      <g fill="#fff">
        <rect x="200" y="80" width="2" height="20" opacity="0.45" />
        <rect x="194" y="74" width="14" height="6" opacity="0.5" />
        <polygon points="201,80 178,116 224,116" opacity="0.12" />
      </g>

      {/* Mug + steam */}
      <g fill="#fff" opacity="0.55">
        <rect x="138" y="120" width="10" height="8" />
        <rect x="148" y="122" width="3" height="4" />
        {/* steam wisps */}
        <rect x="140" y="112" width="2" height="2" opacity="0.5" />
        <rect x="142" y="108" width="2" height="2" opacity="0.4" />
        <rect x="146" y="112" width="2" height="2" opacity="0.45" />
        <rect x="144" y="106" width="2" height="2" opacity="0.35" />
      </g>

      {/* Floor */}
      <rect x="0" y="156" width="320" height="2" fill="#fff" opacity="0.2" />
    </g>
  );
}
