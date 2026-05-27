import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import './globals.css';
import { Chatbot } from '../components/marketing/Chatbot';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans-loaded',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif-loaded',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Claude per Avvocati',
  description: 'Tutto l\'ecosistema Claude, applicato al lavoro di uno studio legale.',
  openGraph: {
    title: 'Claude per Avvocati',
    description: 'Corso scritto · 30 lezioni · Italiano',
    type: 'website',
    locale: 'it_IT',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
