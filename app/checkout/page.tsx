import { Nav } from '../../components/marketing/Nav';
import { Foot } from '../../components/marketing/Foot';
import { CheckoutForm } from '../../components/marketing/CheckoutForm';

export const metadata = { title: 'Iscrizione · Claude per Avvocati' };

export default async function Checkout({
  searchParams,
}: { searchParams: Promise<{ tier?: string }> }) {
  const { tier: tierParam } = await searchParams;
  const tier = tierParam === 'studio' ? 'studio' : 'avvocato';

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream-panel px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-2">Iscrizione · Pagamento sicuro</div>
            <h1 className="font-serif text-3xl font-bold">Conferma il tuo piano.</h1>
          </div>
          <CheckoutForm tier={tier} />
        </div>
      </main>
      <Foot />
    </>
  );
}
