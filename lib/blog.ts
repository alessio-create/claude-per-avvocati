import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

export type BlogCoverColor = 'lilac' | 'sage' | 'peach' | 'lavender' | 'terracotta' | 'mint';
export type BlogCoverIcon =
  | 'clock'
  | 'shield'
  | 'parere'
  | 'folder-stack'
  | 'gear'
  | 'kit'
  | 'vs'
  | 'quill'
  | 'shield-check'
  | 'horizon'
  | 'folder-grid'
  | 'scales';

export interface BlogPostMeta {
  titolo: string;
  sottotitolo: string;
  /** ISO date (YYYY-MM-DD). Used for sorting and display. */
  data: string;
  autore: string;
  /** Reading time in minutes. */
  tempo: number;
  tag: string[];
  coverColor: BlogCoverColor;
  /** Pixel-art icon shown on the cover. Defaults to 'parere' if missing. */
  coverIcon?: BlogCoverIcon;
  /** Optional excerpt for cards/SEO; if omitted, derived from sottotitolo. */
  estratto?: string;
  /** Optional: hide from the index (for drafts). */
  bozza?: boolean;
}

export interface BlogPost extends BlogPostMeta {
  slug: string;
}

const CONTENT_ROOT = join(process.cwd(), 'content', 'blog');
let cached: BlogPost[] | null = null;

export function getBlogIndex(): BlogPost[] {
  if (cached) return cached;
  if (!existsSync(CONTENT_ROOT)) {
    cached = [];
    return cached;
  }
  const files = readdirSync(CONTENT_ROOT).filter((f) => f.endsWith('.mdx'));
  const posts: BlogPost[] = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = readFileSync(join(CONTENT_ROOT, file), 'utf8');
      const { data } = matter(raw);
      return { slug, ...(data as BlogPostMeta) };
    })
    .filter((p) => !p.bozza)
    // newest first
    .sort((a, b) => (a.data < b.data ? 1 : -1));
  cached = posts;
  return cached;
}

export function getBlogPost(slug: string): BlogPost | null {
  return getBlogIndex().find((p) => p.slug === slug) ?? null;
}

/** Format an ISO date for Italian display. */
export function formatItalianDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}
