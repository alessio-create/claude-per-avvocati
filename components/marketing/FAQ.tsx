const faqs = [
  'Non sono tecnico, riesco davvero a seguirlo?',
  "Tra udienze e scadenze non ho tempo, quanto mi costa in ore a settimana?",
  "Posso davvero metterci dentro gli atti dei miei clienti senza violare l'art. 622 c.p. e l'art. 13 CDF?",
  'Come funziona col GDPR, serve un DPA con Anthropic?',
  'Devo pagare Claude a parte oltre al corso?',
  "Il mio gestionale (DeJure, Wolters Kluwer, OneLegale) è compatibile con quello che insegni?",
  'Cosa sono le Skills e perché dovrebbero servirmi in studio?',
  'Mi tocca imparare a programmare per usare Claude Code?',
  "Se Anthropic rilascia una nuova versione di Claude, il corso resta valido o devo ricomprarlo?",
  'Il certificato vale qualcosa per i Crediti Formativi Professionali del COA?',
  "Nel piano Studio i 5 accessi come si gestiscono fra i collaboratori?",
  "Posso partire da Avvocato e passare a Studio dopo, o conviene scegliere subito?",
  "Mi date fattura intestata allo studio con partita IVA?",
  "Se dopo due lezioni capisco che non fa per me, mi rimborsate?",
];

export function FAQ() {
  return (
    <section className="py-20 px-8 max-w-3xl mx-auto">
      <h2 className="font-serif text-3xl font-bold text-center mb-2">Quello che mi chiedono prima di iscriversi</h2>
      <p className="text-sm text-muted text-center mb-8">Risposte dirette alle obiezioni vere. Se la tua non c&apos;è, scrivimi e ti rispondo io.</p>
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
