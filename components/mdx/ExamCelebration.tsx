'use client';
import { useEffect, useState } from 'react';

interface ExamCelebrationProps {
  /** Number of gems awarded for this exam (5–10). */
  gems: number;
  /** Optional headline override. Default: "Esame completato!". */
  titolo?: string;
  /** Optional subtitle. Default surfaces the next-module message. */
  sottotitolo?: string;
  onClose: () => void;
}

const COUNT_UP_MS = 1100;

/**
 * Duolingo-style celebration overlay shown after a module exam is passed
 * for the first time. Vanilla CSS animations only (no framer-motion or
 * canvas-confetti dependency to keep the route bundle small).
 *
 *  - Backdrop fades in
 *  - Modal slides up + scales
 *  - Gem counter counts up from 0 to N over ~1.1s
 *  - 32 confetti particles fall from the top with random colors / delays
 */
export function ExamCelebration({
  gems,
  titolo = 'Esame completato!',
  sottotitolo = 'Hai sbloccato il prossimo modulo.',
  onClose,
}: ExamCelebrationProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (gems <= 0) {
      setDisplayed(0);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / COUNT_UP_MS);
      // Ease-out for a snappier final tick
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(eased * gems));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gems]);

  // Allow Esc to dismiss
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 backdrop-blur-sm animate-[ec-fade_220ms_ease-out_both]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ec-title"
    >
      {/* Confetti — purely decorative, behind the modal */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="absolute top-[-12px] block h-2 w-2 rounded-[2px]"
            style={{
              left: `${c.left}%`,
              backgroundColor: c.color,
              transform: `rotate(${c.rotate}deg)`,
              animation: `ec-fall ${c.duration}ms cubic-bezier(0.18,0.7,0.4,1) ${c.delay}ms forwards`,
            }}
          />
        ))}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border-2 border-terracotta bg-cream px-7 py-8 text-center shadow-2xl animate-[ec-pop_420ms_cubic-bezier(0.18,1.25,0.6,1)_both]"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta text-3xl text-cream shadow-md animate-[ec-bounce_650ms_cubic-bezier(0.28,1.4,0.7,1)_both]">
          ✓
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-terracotta font-bold">Modulo</div>
        <h2 id="ec-title" className="font-serif text-2xl font-bold text-ink mt-1 mb-2">
          {titolo}
        </h2>
        <p className="text-sm text-body mb-6">{sottotitolo}</p>

        <div className="mb-6 inline-flex items-end gap-2 rounded-xl bg-terracotta/10 px-5 py-3">
          <span className="font-serif text-5xl font-bold text-terracotta tabular-nums leading-none">
            +{displayed}
          </span>
          <span className="text-2xl text-terracotta leading-none mb-1">✦</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="block w-full rounded-md bg-ink text-cream px-5 py-3 text-sm font-bold hover:bg-terracotta transition-colors"
          autoFocus
        >
          Continua
        </button>
      </div>

      <style jsx global>{`
        @keyframes ec-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ec-pop {
          from { opacity: 0; transform: translateY(24px) scale(0.94); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ec-bounce {
          0% { transform: scale(0.2); opacity: 0; }
          55% { transform: scale(1.18); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ec-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(115vh) rotate(720deg); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}

// 32 confetti particles. Colors echo the brand (terracotta + cream variants
// plus two greens for variety). Positions/timings precomputed so the layout
// is deterministic across renders (no Math.random in render).
const CONFETTI: Array<{ left: number; color: string; rotate: number; duration: number; delay: number }> = [
  { left: 4,  color: '#d97757', rotate: 12,  duration: 2300, delay: 0   },
  { left: 9,  color: '#6fa28b', rotate: -8,  duration: 2600, delay: 120 },
  { left: 13, color: '#c4623f', rotate: 24,  duration: 2100, delay: 60  },
  { left: 17, color: '#cc8a73', rotate: -32, duration: 2400, delay: 200 },
  { left: 22, color: '#d97757', rotate: 6,   duration: 2700, delay: 90  },
  { left: 27, color: '#6fa28b', rotate: 18,  duration: 2200, delay: 280 },
  { left: 31, color: '#c4623f', rotate: -16, duration: 2500, delay: 40  },
  { left: 35, color: '#d97757', rotate: 28,  duration: 2300, delay: 180 },
  { left: 40, color: '#cc8a73', rotate: -22, duration: 2600, delay: 220 },
  { left: 44, color: '#6fa28b', rotate: 4,   duration: 2400, delay: 110 },
  { left: 48, color: '#c4623f', rotate: 14,  duration: 2200, delay: 30  },
  { left: 52, color: '#d97757', rotate: -10, duration: 2700, delay: 240 },
  { left: 56, color: '#cc8a73', rotate: 22,  duration: 2300, delay: 150 },
  { left: 60, color: '#6fa28b', rotate: -28, duration: 2500, delay: 70  },
  { left: 64, color: '#d97757', rotate: 8,   duration: 2400, delay: 260 },
  { left: 68, color: '#c4623f', rotate: -14, duration: 2200, delay: 100 },
  { left: 72, color: '#cc8a73', rotate: 18,  duration: 2600, delay: 190 },
  { left: 76, color: '#d97757', rotate: -6,  duration: 2300, delay: 50  },
  { left: 80, color: '#6fa28b', rotate: 26,  duration: 2500, delay: 230 },
  { left: 84, color: '#c4623f', rotate: -18, duration: 2400, delay: 130 },
  { left: 88, color: '#d97757', rotate: 10,  duration: 2700, delay: 80  },
  { left: 92, color: '#cc8a73', rotate: -24, duration: 2200, delay: 210 },
  { left: 96, color: '#6fa28b', rotate: 16,  duration: 2500, delay: 160 },
  // A second wave (slightly later) so the rain feels continuous, not one burst
  { left: 7,  color: '#c4623f', rotate: 6,   duration: 2400, delay: 380 },
  { left: 19, color: '#d97757', rotate: -20, duration: 2600, delay: 420 },
  { left: 33, color: '#6fa28b', rotate: 14,  duration: 2300, delay: 360 },
  { left: 46, color: '#cc8a73', rotate: -28, duration: 2500, delay: 440 },
  { left: 58, color: '#d97757', rotate: 22,  duration: 2400, delay: 400 },
  { left: 70, color: '#c4623f', rotate: -10, duration: 2700, delay: 460 },
  { left: 82, color: '#6fa28b', rotate: 4,   duration: 2300, delay: 340 },
  { left: 90, color: '#d97757', rotate: -18, duration: 2600, delay: 480 },
  { left: 25, color: '#cc8a73', rotate: 30,  duration: 2400, delay: 500 },
];
