import Link from 'next/link';
import { getCorsoIndex } from '../../lib/content';

export function RiferimentoCorso({ lezione }: { lezione: string }) {
  const idx = getCorsoIndex();
  for (const m of idx.moduli) {
    const found = m.lezioni.find(l => l.slug === lezione);
    if (found) {
      return (
        <Link
          href={`/corso/${m.slug}/${found.slug}`}
          className="inline-flex items-center gap-1 text-terracotta hover:underline font-medium"
        >
          → {found.titolo}
        </Link>
      );
    }
  }
  return <span className="text-muted">[riferimento non trovato: {lezione}]</span>;
}
