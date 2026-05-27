import type { MetadataRoute } from 'next';
import { getBlogIndex } from '../lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL ?? 'https://claudeperavvocati.it';
  const blogPosts = getBlogIndex().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.data),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/iscriviti-gratis`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/chi-sono`, lastModified: new Date(), changeFrequency: 'yearly' },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' },
    { url: `${base}/termini`, lastModified: new Date(), changeFrequency: 'yearly' },
    ...blogPosts,
  ];
}
