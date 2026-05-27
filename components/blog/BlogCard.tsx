import Link from 'next/link';
import type { BlogPost } from '../../lib/blog';
import { formatItalianDate } from '../../lib/blog';
import { BlogCover } from './BlogCover';

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block rounded-xl border border-line bg-white overflow-hidden hover:shadow-md transition-shadow ${featured ? 'md:col-span-2' : ''}`}
    >
      <div className="relative">
        <BlogCover
          icon={post.coverIcon ?? 'parere'}
          coverColor={post.coverColor}
          height={featured ? 'h-40' : 'h-28'}
        />
        {post.tag[0] && (
          <span className="absolute top-2 right-2 bg-white/85 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider z-10">
            {post.tag[0]}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-1.5">
          {formatItalianDate(post.data)} · {post.tempo} min
        </div>
        <h3 className={`font-serif font-bold leading-tight mb-1 group-hover:text-terracotta transition-colors ${featured ? 'text-lg' : 'text-sm'}`}>
          {post.titolo}
        </h3>
        <p className={`text-muted leading-snug line-clamp-2 ${featured ? 'text-sm' : 'text-xs'}`}>
          {post.estratto ?? post.sottotitolo}
        </p>
        <div className="mt-3 text-[11px] text-terracotta font-semibold">Leggi →</div>
      </div>
    </Link>
  );
}
