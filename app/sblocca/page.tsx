'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function SbloccaContent() {
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get('next') ?? '/corso';
  const token = params.get('token');
  const reason = params.get('reason');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/unlock?token=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`, { redirect: 'manual' })
      .then(res => {
        if (res.ok || res.type === 'opaqueredirect') router.replace(next);
        else setErr('Link non valido o scaduto.');
      })
      .catch(() => setErr('Errore di rete.'));
  }, [token, next, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const r = await fetch('/api/resend-link', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) });
    if (r.ok) setSent(true); else setErr('Riprova più tardi.');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream p-8">
      <div className="max-w-md w-full">
        <h1 className="font-serif text-3xl font-bold mb-4">Accedi al corso</h1>
        {reason === 'expired' && <p className="text-sm text-muted mb-3">Il tuo accesso è scaduto. Inserisci l'email per ricevere un nuovo link.</p>}
        {err && <p className="text-sm text-terracotta mb-3">{err}</p>}
        {sent ? (
          <p className="text-sm text-body">Se l'email è registrata, riceverai il link entro pochi minuti.</p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tuostudio@email.it"
              className="w-full rounded-md border border-line p-3 text-sm"
            />
            <button type="submit" className="w-full rounded-md bg-terracotta text-white py-3 font-semibold">Reinvia link</button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function Sblocca() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-cream">Caricamento...</div>}>
      <SbloccaContent />
    </Suspense>
  );
}
