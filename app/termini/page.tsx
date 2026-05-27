import { Nav } from '../../components/marketing/Nav';
import { Foot } from '../../components/marketing/Foot';

export const metadata = { title: 'Termini, Claude per Avvocati' };

export default function Termini() {
  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-8 py-16">
        <h1 className="font-serif text-4xl font-bold mb-6">Termini di vendita</h1>
        <p className="text-body leading-relaxed">Da redigere da legale prima del lancio.</p>
      </main>
      <Foot />
    </>
  );
}
