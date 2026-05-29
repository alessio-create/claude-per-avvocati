'use client';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';

/**
  * Lead capture form for the free tier. Stores submission in localStorage so
  * the user lands in the course immediately, even before the backend (Resend
  * + a leads endpoint) is wired up. Once an /api/leads route exists, we POST
  * to it in parallel.
  */
export function LeadForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studio, setStudio] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !email || !consent) {
      setError('Compila nome, email e accetta la privacy per continuare.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      // Persist locally so the unlock is immediate, even before the API exists
      localStorage.setItem(
        'cpa_lead_v1',
        JSON.stringify({ name, email, studio, at: new Date().toISOString() }),
      );
      // Fire-and-forget the eventual backend hookup. Silent if endpoint missing.
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, studio, source: 'iscriviti-gratis' }),
        });
      } catch {
        // ignore network errors, submission already stored locally
      }
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-md bg-cream-panel border border-line p-5 text-center">
        <div className="text-[10px] uppercase tracking-widest text-[#6fa28b] font-bold mb-2">
          ✓ Iscrizione confermata
        </div>
        <h3 className="font-serif text-xl font-bold mb-2">Grazie {name}.</h3>
        <p className="text-sm text-body leading-relaxed mb-4">
          Abbiamo registrato i tuoi dati. Prima cosa da fare:
          apri il tour del corso in 7 punti, 3 minuti per orientarti.
          Da lì decidi se partire dal Modulo 1 o fare prima il test di livello.
        </p>
        <Link
          href="/corso/benvenuto"
          className="inline-block bg-terracotta text-white px-6 py-2.5 rounded font-bold text-sm hover:bg-terracotta/90"
        >
          → Apri il tour del corso
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-[11px] uppercase tracking-widest text-muted font-semibold mb-1">
          Nome e cognome <span className="text-terracotta">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Mario Rossi"
          className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-cream-panel focus:bg-white focus:border-terracotta outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-[11px] uppercase tracking-widest text-muted font-semibold mb-1">
          Email <span className="text-terracotta">*</span>
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="mario.rossi@studiolegale.it"
          className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-cream-panel focus:bg-white focus:border-terracotta outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-[11px] uppercase tracking-widest text-muted font-semibold mb-1">
          Studio o organizzazione <span className="text-muted text-[10px] normal-case tracking-normal font-normal">(opzionale)</span>
        </label>
        <input
          type="text"
          value={studio}
          onChange={(e) => setStudio(e.target.value)}
          placeholder="Studio Legale Rossi"
          className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-cream-panel focus:bg-white focus:border-terracotta outline-none transition-colors"
        />
      </div>

      <label className="flex gap-2 items-start text-xs text-muted leading-snug">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-terracotta"
        />
        <span>
          Accetto la <Link href="/privacy" className="text-terracotta hover:underline">privacy</Link> e
          autorizzo l&apos;invio di email su nuove lezioni e aggiornamenti del corso. Cancellabile in ogni momento.
        </span>
      </label>

      {error && <div className="text-xs text-terracotta">{error}</div>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-terracotta text-white py-3 rounded font-bold text-sm hover:bg-terracotta/90 disabled:bg-line disabled:text-muted disabled:cursor-not-allowed"
      >
        {submitting ? 'Invio in corso…' : 'Inizia col Modulo 1 gratis →'}
      </button>
    </form>
  );
}
