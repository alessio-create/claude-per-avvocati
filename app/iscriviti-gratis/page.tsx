import { Nav } from '../../components/marketing/Nav';
import { Foot } from '../../components/marketing/Foot';
import { LeadForm } from '../../components/marketing/LeadForm';
import { ClaudeMascot } from '../../components/illustration/ClaudeMascot';

export const metadata = {
  title: 'Inizia gratis, Claude per Avvocati',
  description:
    'Modulo 1 completo gratis. Lascia nome ed email per ricevere il link di accesso e l\'aggiornamento sulle nuove lezioni.',
};

export default function IscrivitiGratis() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-cream-panel px-6 py-16">
        <div className="max-w-xl mx-auto">
          <div className="bg-white border border-line rounded-xl p-8 shadow-md">
            <div className="flex justify-center mb-6">
              <div className="anim-float">
                <ClaudeMascot variant="happy" size={72} />
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-2">
                Piano gratis
              </div>
              <h1 className="font-serif text-3xl font-bold mb-3">Inizia dal Modulo 1.</h1>
              <p className="text-sm text-body leading-relaxed">
                Lasciaci nome ed email. Ti mandiamo subito il link di accesso al{' '}
                <strong>Modulo 1 completo</strong> (5 lezioni + esame), e ogni volta che pubblichiamo
                una nuova lezione gratuita o un aggiornamento, te lo segnaliamo.
              </p>
            </div>

            <LeadForm />

            <div className="mt-8 pt-6 border-t border-line">
              <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-3">
                Cosa è incluso nel piano gratis
              </div>
              <ul className="space-y-1.5 text-sm text-body">
                {[
                  'Modulo 1 completo (5 lezioni + esame)',
                  'Sistema di gemme: guadagni gemme leggendo M1',
                  'Moduli bonus sbloccabili con le gemme guadagnate',
                  'Aggiornamenti gratuiti via email',
                ].map((f) => (
                  <li key={f} className="flex gap-2 items-start">
                    <span className="text-[#6fa28b] font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[10px] text-muted text-center mt-6 leading-relaxed">
              Niente carta di credito. Niente prova gratuita che scade. Quando vuoi il corso completo,
              passi al piano Avvocato (€79) o Studio (€149) e mantieni tutti i progressi.
            </p>
          </div>
        </div>
      </main>
      <Foot />
    </>
  );
}
