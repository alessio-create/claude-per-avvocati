import { Resend } from 'resend';

let _client: Resend | null = null;
function client(): Resend {
  if (!_client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY not set');
    _client = new Resend(key);
  }
  return _client;
}

export interface MagicLinkEmail { to: string; magicLink: string; tier: string }

export async function sendMagicLink({ to, magicLink, tier }: MagicLinkEmail): Promise<void> {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error('RESEND_FROM_EMAIL not set');
  await client().emails.send({
    from,
    to,
    subject: 'Benvenuto in Claude per Avvocati',
    html: `<div style="font-family: ui-sans-serif, system-ui, sans-serif; color:#463d33; max-width: 540px; margin: 0 auto;">
      <h1 style="font-family: Georgia, serif; font-weight: 700; color: #1a1714;">Benvenuto in Claude per Avvocati.</h1>
      <p>Grazie per esserti iscritto al piano <strong>${tier}</strong>. Clicca qui sotto per accedere al corso:</p>
      <p><a href="${magicLink}" style="display:inline-block; background:#d97757; color:#fff; padding:12px 26px; border-radius:4px; text-decoration:none; font-weight:700;">Accedi al corso</a></p>
      <p style="font-size: 13px; color: #6b6055;">Il link è valido per 2 anni. Conservalo. Se hai bisogno di un nuovo link, vai su <a href="${process.env.SITE_URL}/sblocca">${process.env.SITE_URL}/sblocca</a>.</p>
    </div>`,
  });
}
