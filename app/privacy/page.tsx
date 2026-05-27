import { Nav } from '../../components/marketing/Nav';
import { Foot } from '../../components/marketing/Foot';

export const metadata = { title: 'Privacy, Claude per Avvocati' };

export default function Privacy() {
  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-8 py-16">
        <h1 className="font-serif text-4xl font-bold mb-6">Privacy</h1>
        <p className="text-body leading-relaxed">Da redigere da legale prima del lancio.</p>
      </main>
      <Foot />
    </>
  );
}
