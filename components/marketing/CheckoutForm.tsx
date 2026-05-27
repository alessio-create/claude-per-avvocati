'use client';
import Link from 'next/link';
import { useMemo, useState, type FormEvent } from 'react';
import { ClaudeMascot } from '../illustration/ClaudeMascot';

type TierKey = 'avvocato' | 'studio';

interface TierInfo {
  name: string;
  price: number;
  blurb: string;
  bullets: string[];
}

const TIERS: Record<TierKey, TierInfo> = {
  avvocato: {
    name: 'Avvocato',
    price: 79,
    blurb: 'Per la pratica individuale',
    bullets: [
      '6 moduli core + esami di modulo',
      '1 modulo bonus a scelta',
      'Certificato finale + share LinkedIn',
      'Fattura intestata + rimborso 14 giorni',
      'Aggiornamenti a vita',
    ],
  },
  studio: {
    name: 'Studio',
    price: 149,
    blurb: 'Fino a 5 avvocati',
    bullets: [
      'Tutto del piano Avvocato',
      '5 accessi nominativi per lo studio',
      'Tutti i 4 moduli bonus inclusi',
      'Q&A 1:1 di onboarding (30 min)',
      'Setup MCP base + 2 prompt-template personalizzati',
    ],
  },
};

const BUMP = {
  price: 29,
  name: 'Audit marketing legale FutureLaw',
  tagline: '30 minuti, scritto, in PDF · normalmente €120',
  bullets: [
    'Audit completo del tuo posizionamento online (SEO, LinkedIn, Google Business)',
    '3 raccomandazioni concrete prioritizzate per impatto/sforzo',
    'PDF consegnato entro 5 giorni lavorativi',
    'Una call follow-up di 15 min entro 30 giorni',
  ],
};

export function CheckoutForm({ tier }: { tier: TierKey }) {
  const tierInfo = TIERS[tier];
  const [bumpOn, setBumpOn] = useState(true); // default on (the upsell)
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [studio, setStudio] = useState('');
  const [piva, setPiva] = useState('');
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [accept, setAccept] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(() => tierInfo.price + (bumpOn ? BUMP.price : 0), [tierInfo.price, bumpOn]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !name || !card || !accept) {
      setError('Compila i campi obbligatori e accetta i termini per continuare.');
      return;
    }
    setError(null);
    setSubmitting(true);
    // In production: POST to /api/checkout → Stripe/Gumroad, returns redirect URL.
    // For the demo flow, hit dev-unlock with the tier and bump preference;
    // it sets the cpa_session cookie and redirects to /corso.
    window.location.href = `/api/dev-unlock?tier=${tier}${bumpOn ? '&bump=1' : ''}`;
  }

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
      {/* LEFT: payment form */}
      <div className="bg-white border border-line rounded-xl p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold mb-1">Dati di pagamento</h2>
        <p className="text-xs text-muted mb-5">Pagamento sicuro processato via Gumroad. Nessun dato carta passa dal nostro server.</p>

        {/* Buyer info */}
        <div className="space-y-3 mb-6">
          <Field label="Email per fattura e accesso" required>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mario.rossi@studiolegale.it"
              className="cpa-input"
            />
          </Field>
          <Field label="Nome e cognome" required>
            <input
              type="text" required value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mario Rossi"
              className="cpa-input"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ragione sociale / Studio">
              <input
                type="text" value={studio}
                onChange={(e) => setStudio(e.target.value)}
                placeholder="Studio Legale Rossi"
                className="cpa-input"
              />
            </Field>
            <Field label="P. IVA / Cod. Fiscale">
              <input
                type="text" value={piva}
                onChange={(e) => setPiva(e.target.value)}
                placeholder="01234567890"
                className="cpa-input"
              />
            </Field>
          </div>
        </div>

        {/* Card */}
        <div className="border-t border-line pt-5 mb-6">
          <h3 className="text-[11px] uppercase tracking-widest text-muted font-bold mb-3">Carta di credito</h3>
          <div className="space-y-3">
            <Field label="Numero carta" required>
              <input
                type="text" required value={card}
                onChange={(e) => setCard(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="cpa-input font-mono"
                inputMode="numeric"
                autoComplete="cc-number"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Scadenza (MM/AA)">
                <input
                  type="text" value={exp}
                  onChange={(e) => setExp(e.target.value)}
                  placeholder="12/28"
                  className="cpa-input font-mono"
                  autoComplete="cc-exp"
                />
              </Field>
              <Field label="CVV">
                <input
                  type="text" value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="cpa-input font-mono"
                  autoComplete="cc-csc"
                />
              </Field>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-muted leading-snug mb-5">
          <input
            type="checkbox" checked={accept}
            onChange={(e) => setAccept(e.target.checked)}
            className="mt-0.5 accent-terracotta"
          />
          <span>
            Accetto i <Link href="/termini" className="text-terracotta hover:underline">termini</Link> e
            la <Link href="/privacy" className="text-terracotta hover:underline">privacy</Link>.
            Confermo che i dati di fatturazione sono corretti.
          </span>
        </label>

        {error && <div className="text-xs text-terracotta mb-3">{error}</div>}

        <button
          type="submit" disabled={submitting}
          className="w-full bg-terracotta text-white py-3.5 rounded-md font-bold text-sm shadow hover:bg-terracotta/90 disabled:bg-line disabled:text-muted"
        >
          {submitting ? 'Elaborazione…' : `Paga €${total} e accedi al corso →`}
        </button>

        <p className="text-[10px] text-muted text-center mt-3">
          🔒 Connessione cifrata · Rimborso 14 giorni senza domande
        </p>
      </div>

      {/* RIGHT: order summary + bump */}
      <aside className="space-y-4 sticky top-20">
        {/* Order summary */}
        <div className="bg-white border border-line rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="anim-float">
              <ClaudeMascot variant="happy" size={36} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold">Piano {tierInfo.name}</div>
              <div className="font-serif font-bold text-base">{tierInfo.blurb}</div>
            </div>
          </div>
          <ul className="space-y-1.5 mb-4">
            {tierInfo.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-[11px] text-body leading-snug">
                <span className="text-[#6fa28b] font-bold shrink-0">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-baseline justify-between border-t border-line pt-3">
            <span className="text-xs text-muted">Corso, una tantum</span>
            <span className="font-serif text-xl font-bold tabular-nums">€{tierInfo.price}</span>
          </div>
        </div>

        {/* Order bump: FutureLaw audit */}
        <div className={`rounded-xl border-2 p-5 transition-colors ${bumpOn ? 'border-terracotta bg-[#fff7f1]' : 'border-dashed border-line bg-white'}`}>
          <label className="flex gap-3 items-start cursor-pointer">
            <input
              type="checkbox" checked={bumpOn}
              onChange={(e) => setBumpOn(e.target.checked)}
              className="mt-1 w-5 h-5 accent-terracotta shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[10px] uppercase tracking-widest text-terracotta font-bold">Aggiungi all&apos;ordine</span>
                <span className="text-[10px] bg-[#6fa28b] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">−76%</span>
              </div>
              <h3 className="font-serif text-base font-bold mt-1">{BUMP.name}</h3>
              <p className="text-xs text-muted leading-snug mb-3">{BUMP.tagline}</p>
              <ul className="space-y-1 mb-3">
                {BUMP.bullets.map((b) => (
                  <li key={b} className="flex gap-1.5 text-[11px] text-body leading-snug">
                    <span className="text-terracotta shrink-0">+</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-baseline justify-between border-t border-terracotta/30 pt-2 mt-2">
                <span className="text-[11px] text-body font-semibold">Solo per chi compra il corso</span>
                <span className="font-serif text-lg font-bold text-terracotta tabular-nums">+€{BUMP.price}</span>
              </div>
            </div>
          </label>
        </div>

        {/* Total */}
        <div className="bg-ink text-cream rounded-xl p-5">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[11px] uppercase tracking-widest text-terracotta-soft font-bold">Totale</span>
            <span className="font-serif text-3xl font-bold tabular-nums text-terracotta">€{total}</span>
          </div>
          <p className="text-[10px] text-muted">
            Una tantum, IVA inclusa. Fattura intestata allo studio.
          </p>
        </div>

        <p className="text-[10px] text-muted text-center px-2">
          FutureLaw è lo studio di marketing legale di Alessio Massaro, il curatore del corso. <Link href="https://futurelaw.it" className="text-terracotta hover:underline" target="_blank" rel="noopener noreferrer">futurelaw.it</Link>
        </p>
      </aside>

      <style>{`
        .cpa-input {
          width: 100%;
          border: 1px solid var(--color-line, #e6dfd2);
          background: #fbf8f1;
          border-radius: 6px;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          transition: border-color 120ms, background 120ms;
        }
        .cpa-input:focus {
          outline: none;
          border-color: #d97757;
          background: #fff;
        }
      `}</style>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">
        {label} {required && <span className="text-terracotta">*</span>}
      </div>
      {children}
    </label>
  );
}
