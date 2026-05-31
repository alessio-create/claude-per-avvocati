'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ClaudeStar } from '../illustration/ClaudeStar';
import { useTier } from '../../lib/use-tier';
import { isPaid } from '../../lib/access';

const LINKS = [
  { href: '/#programma', label: 'Programma' },
  { href: '/corso', label: 'Corso' },
  { href: '/corso/30-giorni', label: '30 giorni' },
  { href: '/#prezzi', label: 'Prezzi' },
  { href: '/blog', label: 'Blog' },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const me = useTier();
  // While `me` is still loading we render the anonymous variant — it's the
  // safe default for first paint (an unauthenticated visitor seeing "Accedi"
  // is fine; a paid customer briefly seeing "Inizia gratis" would be
  // jarring but resolves in milliseconds after /api/me returns).
  const paid = me ? isPaid(me.tier) : false;

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  return (
    <>
      <nav className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-8 py-4 border-b border-line bg-cream text-sm">
        <div className="flex flex-col leading-tight">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-terracotta tracking-tight text-xl leading-none">
            <ClaudeStar size={24} />
            <span className="hidden xs:inline sm:inline">Claude per Avvocati</span>
            <span className="xs:hidden sm:hidden">Claude · Avvocati</span>
          </Link>
          {/* Tiny attribution row, links out to the parent studio. Grey to
              stay subordinate to the main logo above. */}
          <a
            href="https://thefuturelawstudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-0.5 ml-[32px] text-[8.5px] uppercase tracking-widest text-muted hover:text-ink transition-colors"
          >
            <span>by</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/futurelaw.svg" alt="" className="h-3 w-3 opacity-60" />
            <span className="font-semibold">The Future Law Studio</span>
          </a>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex gap-6 text-muted text-xs font-medium">
          {LINKS.map((l) =>
            l.href.startsWith('/blog') ? (
              <Link key={l.href} href={l.href} className="hover:text-terracotta">{l.label}</Link>
            ) : (
              <a key={l.href} href={l.href} className="hover:text-terracotta">{l.label}</a>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop auth CTAs — tier-aware */}
          {paid ? (
            <Link
              href="/corso"
              className="hidden sm:inline-flex items-center gap-1.5 bg-terracotta text-white px-4 py-1.5 rounded font-bold text-xs shadow-sm hover:bg-terracotta/90"
            >
              Vai al corso →
            </Link>
          ) : (
            <>
              <Link
                href="/sblocca"
                className="hidden sm:inline-block text-ink hover:text-terracotta px-3 py-1.5 text-xs font-semibold"
              >
                Accedi
              </Link>
              <Link
                href="/iscriviti-gratis"
                className="hidden sm:inline-block bg-terracotta text-white px-4 py-1.5 rounded font-bold text-xs shadow-sm hover:bg-terracotta/90"
              >
                Inizia col Modulo 1 gratis
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-md border border-line bg-white flex items-center justify-center text-ink"
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6 L18 18 M18 6 L6 18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 7 H21 M3 12 H21 M3 17 H21" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-cream pt-16 px-6">
          <ul className="flex flex-col gap-1 mt-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                {l.href.startsWith('/blog') ? (
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 px-3 rounded-md text-base font-semibold text-ink hover:bg-cream-panel"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 px-3 rounded-md text-base font-semibold text-ink hover:bg-cream-panel"
                  >
                    {l.label}
                  </a>
                )}
              </li>
            ))}
            {paid ? (
              <li className="mt-4">
                <Link
                  href="/corso"
                  onClick={() => setOpen(false)}
                  className="block text-center bg-terracotta text-white py-3 rounded-md font-bold text-sm shadow"
                >
                  Vai al corso →
                </Link>
              </li>
            ) : (
              <>
                <li className="mt-4">
                  <Link
                    href="/iscriviti-gratis"
                    onClick={() => setOpen(false)}
                    className="block text-center bg-terracotta text-white py-3 rounded-md font-bold text-sm shadow"
                  >
                    Inizia col Modulo 1 gratis
                  </Link>
                </li>
                <li className="mt-2">
                  <Link
                    href="/sblocca"
                    onClick={() => setOpen(false)}
                    className="block text-center border border-line bg-white text-ink py-3 rounded-md font-semibold text-sm"
                  >
                    Accedi
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
