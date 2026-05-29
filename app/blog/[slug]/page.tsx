import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '../../../components/marketing/Nav';
import { Foot } from '../../../components/marketing/Foot';
import { BlogCard } from '../../../components/blog/BlogCard';
import { getBlogIndex, getBlogPost, formatItalianDate } from '../../../lib/blog';
import type { Metadata } from 'next';

interface Params { slug: string }

export function generateStaticParams() {
  return getBlogIndex().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Articolo, Claude per Avvocati' };
  return {
    title: `${post.titolo}, Blog Claude per Avvocati`,
    description: post.estratto ?? post.sottotitolo,
    openGraph: {
      title: post.titolo,
      description: post.estratto ?? post.sottotitolo,
      type: 'article',
      publishedTime: post.data,
      authors: [post.autore],
      tags: post.tag,
    },
  };
}

export default async function BlogArticle({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  let MDX;
  try {
    MDX = (await import(`../../../content/blog/${slug}.mdx`)).default;
  } catch {
    notFound();
  }

  // Related: 3 most recent other posts sharing at least one tag, else most recent
  const all = getBlogIndex().filter((p) => p.slug !== slug);
  const tagSet = new Set(post.tag);
  const sameTag = all.filter((p) => p.tag.some((t) => tagSet.has(t))).slice(0, 3);
  const related = sameTag.length >= 3 ? sameTag : all.slice(0, 3);

  return (
    <>
      <Nav />
      <main className="bg-cream min-h-screen px-6 py-12">
        <article className="max-w-2xl mx-auto">
          <nav className="text-xs text-muted mb-6 flex items-center gap-1.5">
            <Link href="/blog" className="hover:text-terracotta">Blog</Link>
            <span className="text-line">/</span>
            <span className="text-ink truncate">{post.titolo}</span>
          </nav>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tag.map((t) => (
              <span key={t} className="bg-cream-panel text-terracotta border border-line px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
                {t}
              </span>
            ))}
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-[1.1] mb-3">{post.titolo}</h1>
          <p className="font-serif text-xl text-muted leading-snug italic mb-5">{post.sottotitolo}</p>
          <div className="flex items-center gap-3 text-xs text-muted border-b border-line pb-5 mb-8">
            <span className="font-semibold text-body">{post.autore}</span>
            <span>·</span>
            <span>{formatItalianDate(post.data)}</span>
            <span>·</span>
            <span>{post.tempo} min di lettura</span>
          </div>

          <div className="prose-blog max-w-none text-body leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-7 [&_h3]:mb-2 [&_p]:my-4 [&_p]:text-base [&_p]:leading-[1.7] [&_ul]:my-4 [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:list-disc [&_ol]:my-4 [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:list-decimal [&_li]:text-base [&_li]:leading-[1.7] [&_strong]:font-semibold [&_a]:text-terracotta [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:no-underline [&_blockquote]:border-l-4 [&_blockquote]:border-terracotta [&_blockquote]:bg-cream-panel [&_blockquote]:pl-4 [&_blockquote]:pr-3 [&_blockquote]:py-2 [&_blockquote]:my-5 [&_blockquote]:italic [&_blockquote]:text-body [&_code]:bg-cream-panel [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.9em] [&_code]:font-mono [&_pre]:bg-ink [&_pre]:text-cream [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:text-[0.9em] [&_hr]:my-10 [&_hr]:border-line [&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_th]:bg-cream-panel [&_th]:text-left [&_th]:p-2 [&_th]:border [&_th]:border-line [&_th]:text-sm [&_td]:p-2 [&_td]:border [&_td]:border-line [&_td]:text-sm">
            <MDX />
          </div>

          {/* CTA back to the course */}
          <div className="mt-12 rounded-xl border-2 border-terracotta bg-gradient-to-br from-white to-cream-panel p-6">
            <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">Corso completo</div>
            <h3 className="font-serif text-xl font-bold mb-2">Vuoi mettere in pratica tutto questo?</h3>
            <p className="text-sm text-body leading-snug mb-4">
              Il corso "Claude per Avvocati" copre Chat, Projects, Code, Skills, MCP, API + privacy e
              deontologia. Modulo 1 gratis, niente carta.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/iscriviti-gratis"
                className="bg-terracotta text-white px-5 py-2.5 rounded font-bold text-sm hover:bg-terracotta/90"
              >
                Inizia col Modulo 1 gratis →
              </Link>
              <Link
                href="/#prezzi"
                className="border border-line bg-white text-ink px-5 py-2.5 rounded font-semibold text-sm hover:border-terracotta hover:text-terracotta"
              >
                Vedi i piani
              </Link>
            </div>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <section className="mt-12">
              <h3 className="font-serif text-xl font-bold mb-4">Altri articoli</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {related.map((p) => <BlogCard key={p.slug} post={p} />)}
              </div>
            </section>
          )}
        </article>
      </main>
      <Foot />
    </>
  );
}
