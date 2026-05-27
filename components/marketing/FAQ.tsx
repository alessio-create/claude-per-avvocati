const faqs = [
  'Serve un abbonamento a Claude separato dal corso?',
  'Posso usare Claude con i dati dei miei clienti? GDPR e segreto professionale?',
  'Cosa sono le Skills e perché mi servono come avvocato?',
  'Devo saper programmare per usare Claude Code?',
  "Quanto dura l'accesso? Aggiornamenti inclusi?",
  'Il certificato è riconosciuto per i Crediti Formativi Professionali?',
  'Posso scaricare la fattura intestata allo studio?',
  "C'è una garanzia di rimborso?",
];

export function FAQ() {
  return (
    <section className="py-20 px-8 max-w-3xl mx-auto">
      <h2 className="font-serif text-3xl font-bold text-center mb-2">Domande frequenti</h2>
      <p className="text-sm text-muted text-center mb-8">Le risposte alle obiezioni che ricevo ogni giorno. Se manca la tua, scrivimi.</p>
      <div className="space-y-2">
        {faqs.map((q, i) => (
          <div key={i} className="bg-white border border-line rounded-lg p-4 flex gap-4 items-center hover:border-terracotta transition-colors cursor-pointer shadow-sm">
            <div className="flex-1 font-serif font-semibold text-sm text-ink leading-snug">{q}</div>
            <span className="text-terracotta font-bold text-lg shrink-0">+</span>
          </div>
        ))}
      </div>
    </section>
  );
}
