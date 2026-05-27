'use client';
import { useEffect, useState } from 'react';
import { getGems, type GemsState } from '../../lib/gems';

export function GemsWidget() {
  const [state, setState] = useState<GemsState | null>(null);

  useEffect(() => {
    setState(getGems());
    const handler = (e: Event) => setState((e as CustomEvent<GemsState>).detail ?? getGems());
    window.addEventListener('cpa-gems-changed', handler);
    return () => window.removeEventListener('cpa-gems-changed', handler);
  }, []);

  if (!state) {
    return (
      <div className="rounded-md border border-line bg-cream p-3 text-xs text-muted">
        <div className="font-bold text-terracotta"></div>
      </div>
    );
  }

  const lezioniLette = state.reads.length;
  const quizPassati = state.quizPasses.length;
  const moduliCompleti = state.moduleBonuses.length;

  return (
    <div className="rounded-md border border-line bg-white p-3 shadow-sm">
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-2xl font-bold text-terracotta tabular-nums">{state.total}</span>
        <span className="text-terracotta font-bold">✦</span>
      </div>
      <div className="mt-1.5 text-[10px] uppercase tracking-wider text-muted font-semibold">Gemme guadagnate</div>
      <div className="mt-2 pt-2 border-t border-line space-y-0.5 text-[10px] text-muted leading-snug">
        <div><strong className="text-ink tabular-nums">{lezioniLette}</strong> lezioni lette</div>
        <div><strong className="text-ink tabular-nums">{quizPassati}</strong> quiz superati</div>
        {moduliCompleti > 0 && (
          <div><strong className="text-ink tabular-nums">{moduliCompleti}</strong> moduli completi <span className="text-terracotta">+10 ✦ cad.</span></div>
        )}
      </div>
    </div>
  );
}
