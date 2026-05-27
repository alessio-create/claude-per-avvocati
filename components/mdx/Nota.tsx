type Tipo = 'attenzione' | 'suggerimento' | 'esempio';
const styles: Record<Tipo, string> = {
  attenzione: 'border-l-terracotta bg-cream-panel',
  suggerimento: 'border-l-yellow bg-cream-panel',
  esempio: 'border-l-cover-sage bg-cream-panel',
};
const labels: Record<Tipo, string> = {
  attenzione: 'Attenzione',
  suggerimento: 'Suggerimento',
  esempio: 'Esempio',
};

export function Nota({ tipo = 'suggerimento', children }: { tipo?: Tipo; children: React.ReactNode }) {
  return (
    <aside className={`my-5 rounded-md border border-line border-l-4 p-4 text-sm ${styles[tipo]}`}>
      <div className="text-xs uppercase tracking-widest font-semibold mb-1 text-ink">{labels[tipo]}</div>
      <div className="text-body">{children}</div>
    </aside>
  );
}
