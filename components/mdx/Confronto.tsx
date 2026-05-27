export function Confronto({
  senza,
  con,
}: { senza: React.ReactNode; con: React.ReactNode }) {
  return (
    <div className="my-6 grid gap-3 md:grid-cols-2">
      <div className="rounded-md border border-line bg-cream-panel p-4">
        <div className="text-xs uppercase tracking-widest text-muted font-semibold mb-2">Senza Claude</div>
        <div className="text-sm text-body">{senza}</div>
      </div>
      <div className="rounded-md border-2 border-terracotta bg-white p-4">
        <div className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-2">Con Claude</div>
        <div className="text-sm text-body">{con}</div>
      </div>
    </div>
  );
}
