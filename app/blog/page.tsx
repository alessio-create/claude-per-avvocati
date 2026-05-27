import { Nav } from '../../components/marketing/Nav';
import { Foot } from '../../components/marketing/Foot';
import { BlogCard } from '../../components/blog/BlogCard';
import { getBlogIndex } from '../../lib/blog';

export const metadata = {
  title: 'Blog, Claude per Avvocati',
  description:
    'Approfondimenti pratici su Claude, AI e diritto: prompt engineering per pareri, GDPR, automazione su fascicoli, Custom Instructions per studi legali.',
};

export default function BlogIndex() {
  const posts = getBlogIndex();
  const [featured, ...rest] = posts;

  return (
    <>
      <Nav />
      <main className="bg-cream min-h-screen">
        <section className="px-8 pt-16 pb-10 max-w-5xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-terracotta font-bold mb-2">Blog</div>
          <h1 className="font-serif text-5xl font-bold leading-tight mb-3">
            Claude per uno studio legale.
          </h1>
          <p className="text-base text-muted leading-snug max-w-2xl mb-10">
            Approfondimenti pratici, casi concreti, errori comuni. Tutto quello che non sta nel corso 
            o che lo amplia. Niente clickbait, solo cose che useresti lunedì mattina.
          </p>

          {posts.length === 0 && (
            <div className="rounded-xl border border-dashed border-line bg-cream-panel p-12 text-center">
              <p className="text-muted">Articoli in arrivo presto.</p>
            </div>
          )}

          {posts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured && <BlogCard post={featured} featured />}
              {rest.map((p) => <BlogCard key={p.slug} post={p} />)}
            </div>
          )}
        </section>
      </main>
      <Foot />
    </>
  );
}
