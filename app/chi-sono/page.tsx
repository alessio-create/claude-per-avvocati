import { Nav } from '../../components/marketing/Nav';
import { Foot } from '../../components/marketing/Foot';

export const metadata = { title: 'Chi sono, Claude per Avvocati' };

export default function ChiSono() {
  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-8 py-16">
        <h1 className="font-serif text-4xl font-bold mb-6">Chi sono</h1>
        <p className="text-body leading-relaxed">Bio + positioning. Authored before launch.</p>
      </main>
      <Foot />
    </>
  );
}
