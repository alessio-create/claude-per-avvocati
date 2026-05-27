export function buildMagicLink(token: string): string {
  const base = process.env.SITE_URL;
  if (!base) throw new Error('SITE_URL not set');
  return `${base}/sblocca?token=${encodeURIComponent(token)}`;
}
