'use client';
import { useState } from 'react';

export function Prompt({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const text = typeof children === 'string' ? children : '';

  return (
    <div className="my-6 rounded-md border border-line border-l-4 border-l-terracotta bg-cream-panel p-4 font-mono text-sm text-body">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">Prompt</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="text-xs text-terracotta hover:underline"
        >
          {copied ? 'Copiato ✓' : 'Copia'}
        </button>
      </div>
      <pre className="whitespace-pre-wrap m-0">{children}</pre>
    </div>
  );
}
