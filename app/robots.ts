import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.SITE_URL ?? 'https://claudeperavvocati.it';
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/corso/', '/api/', '/sblocca'] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
