import Link from 'next/link';
import { Nav } from '../../../components/marketing/Nav';
import { Foot } from '../../../components/marketing/Foot';
import { ClaudeStar } from '../../../components/illustration/ClaudeStar';

export const metadata = { title: 'Iscrizione completata · Claude per Avvocati' };

/**
 * Stripe redirects here after a successful checkout. The actual
 * provisioning (JWT mint + magic-link email) is driven by the
 * `checkout.session.completed` webhook, not by this page, so we only show
 * the buyer that they need to check their inbox.
 */
export default async function CheckoutSuccess({
  searchParams,
}: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;

  return (
    <>
      <Nav />
      <main className="min-h-[70vh] bg-cream px-6 py-16">
        <div className="max-w-md mx-auto text-center bg-white border border-line rounded-xl p-8 shadow-sm">
          <div className="flex justify-center mb-3"><ClaudeStar size={56} /></div>
          <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">Pagamento ricevuto</div>
          <h1 className="font-serif text-2xl font-bold mb-3">Grazie, sei dentro.</h1>
          <p className="text-sm text-body leading-snug m-0 mb-5">
            Stai per ricevere un&apos;email con il link magico per accedere al corso. Apri la posta (controlla anche spam/promo) entro 2-3 minuti.
          </p>
          <p className="text-[12px] text-muted leading-snug m-0 mb-6">
            La fattura arriverà via email da Stripe entro 24 ore. Se non arriva il link entro qualche minuto, scrivici a <a href="mailto:fatture@claudeperavvocati.it" className="text-terracotta hover:underline">fatture@claudeperavvocati.it</a> (allega l&apos;email usata).
          </p>
          <Link
            href="/sblocca"
            className="inline-block rounded-md bg-terracotta text-white px-5 py-2.5 text-sm font-bold shadow hover:bg-terracotta/90"
          >
            Hai già ricevuto il link?
          </Link>
          {sessionId && (
            <p className="text-[10px] text-muted mt-4 m-0 break-all">
              Ref: {sessionId}
            </p>
          )}
        </div>
      </main>
      <Foot />
    </>
  );
}
