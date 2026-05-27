export function Esempio({ children }: { children: React.ReactNode }) {
  return (
    <section className="my-6 rounded-md border border-line bg-white p-5">
      <div className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-3">Esempio</div>
      <div className="space-y-3 text-sm text-body">{children}</div>
    </section>
  );
}
