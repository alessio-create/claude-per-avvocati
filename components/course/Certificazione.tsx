'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { rewardCertificazione, hasCertificazione, getCertificazione } from '../../lib/gems';
import { useTier } from '../../lib/use-tier';
import { isPaid } from '../../lib/access';
import { ClaudeStar } from '../illustration/ClaudeStar';
import { LockIcon } from '../illustration/LockIcon';

interface Domanda {
  modulo: string;
  domanda: string;
  opzioni: string[];
  corretta: number;
  spiega?: string;
}

interface CertRecord {
  passedAt: string;
  punteggio: number;
  nome: string;
}

export function Certificazione({
  domande,
  passaCon,
}: { domande: Domanda[]; passaCon: number }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => domande.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [justEarned, setJustEarned] = useState(false);
  const [nome, setNome] = useState('');
  const [confirmedName, setConfirmedName] = useState(false);
  const [cert, setCert] = useState<CertRecord | null>(null);

  // Defense in depth: even if the outer <CertificazioneGate> is somehow
  // bypassed (back-button after upgrade-then-downgrade, manipulated cookie,
  // legacy localStorage from before the gate existed), this internal tier
  // check ensures a non-paying visitor can never reach the cert-passed view
  // or the download button. Loading state shows a placeholder; resolved-
  // free tier shows an inline upgrade panel.
  const me = useTier();
  const tierLoading = me === null;
  const allowed = me ? isPaid(me.tier) : false;

  // Restore prior pass on mount: if the user already earned the cert, jump
  // straight to the certificate view with the stored name + timestamp.
  // Gated by `allowed` so a free user with leftover localStorage still
  // sees the upgrade panel, not the certificate.
  useEffect(() => {
    if (!allowed) return;
    if (hasCertificazione()) {
      const stored = getCertificazione();
      if (stored) {
        setCert(stored);
        setConfirmedName(true);
        setSubmitted(true);
        setAnswers(domande.map((d) => d.corretta));
      }
    }
  }, [domande, allowed]);

  const correctCount = answers.reduce<number>(
    (acc, a, i) => acc + (a === domande[i].corretta ? 1 : 0),
    0,
  );
  const allAnswered = answers.every((a) => a !== null);
  const trimmedNome = nome.trim();
  const nomeOk = trimmedNome.length >= 3 && /\s/.test(trimmedNome); // at least name + surname
  const passed = submitted && correctCount >= passaCon;

  const onSubmit = () => {
    // Hard guard: a free user must never be able to claim the cert.
    if (!allowed) return;
    setSubmitted(true);
    if (correctCount >= passaCon) {
      const newlyAwarded = rewardCertificazione(correctCount, trimmedNome);
      if (newlyAwarded) setJustEarned(true);
      // Snapshot the stored record so the cert view shows the canonical name
      // + passedAt (not the one in component state, which is just the input).
      const stored = getCertificazione();
      if (stored) setCert(stored);
    }
  };

  const onRetry = () => {
    setAnswers(domande.map(() => null));
    setSubmitted(false);
    setJustEarned(false);
  };

  // Loading: never reveal the cert UI until tier resolves.
  if (tierLoading) {
    return <div className="my-10 min-h-[200px]" aria-hidden />;
  }

  // Free / anonymous user reached this component despite the outer gate:
  // show an inline upgrade panel and refuse to render the quiz, cert, or
  // download button. This is defense in depth, the gate normally handles it.
  if (!allowed) {
    return (
      <section className="my-10 rounded-xl border-2 border-terracotta bg-gradient-to-br from-white to-cream-panel p-8 shadow-md text-center">
        <div className="flex justify-center mb-3"><LockIcon size={36} className="text-terracotta" /></div>
        <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">Riservata agli iscritti</div>
        <h3 className="font-serif text-2xl font-bold m-0 mb-2">La certificazione richiede il piano Avvocato</h3>
        <p className="text-sm text-muted m-0 mb-5 max-w-md mx-auto leading-snug">
          Quiz, certificato stampabile, download e condivisione su LinkedIn sono inclusi nel piano <strong>Avvocato (€79)</strong>. Sul piano gratis è visibile solo l&apos;anteprima.
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          <Link href="/checkout?tier=avvocato" className="rounded-md bg-terracotta text-white px-5 py-2.5 text-sm font-bold shadow hover:bg-terracotta/90">
            Acquista il corso + certificazione, €79
          </Link>
          <Link href="/#prezzi" className="rounded-md border border-line bg-white text-ink px-5 py-2.5 text-sm font-semibold hover:border-terracotta hover:text-terracotta">
            Confronta i piani
          </Link>
        </div>
      </section>
    );
  }

  if (passed && cert) {
    return <PassedView cert={cert} totale={domande.length} justEarned={justEarned} />;
  }

  return (
    <section className="my-10 rounded-xl border-2 border-terracotta bg-white p-6 shadow-md">
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold">Prova finale</div>
          <h3 className="font-serif text-2xl font-bold text-ink m-0 mt-1">Certificazione Claude per Avvocati</h3>
          <p className="text-xs text-muted mt-1 m-0">Una domanda per ciascuno dei {domande.length} moduli.</p>
        </div>
        <div className="text-xs text-muted shrink-0 text-right">
          Pass: <strong className="text-ink">{passaCon}/{domande.length}</strong>
          <br />
          Ricompensa: <strong className="text-terracotta">+50 ✦</strong>
        </div>
      </div>

      {/* Name-entry gate: must be completed before the quiz becomes usable.
          Once confirmed it is locked, no edits — the printed certificate will
          carry this exact string. */}
      <div className="mb-7 rounded-lg border-2 border-dashed border-terracotta/60 bg-gradient-to-br from-cream-panel to-[#fff7f1] p-5">
        <div className="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-1">Passo 1 · Nome sul certificato</div>
        <h4 className="font-serif text-lg font-bold m-0 mb-2">Come deve apparire il tuo nome?</h4>
        <p className="text-xs text-muted m-0 mb-3 leading-snug">
          Inserisci nome e cognome esattamente come vuoi che appaiano sul certificato e sul tuo profilo LinkedIn.
        </p>
        {!confirmedName ? (
          <>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Es. Anna Maria Bianchi"
              autoComplete="name"
              spellCheck={false}
              className="w-full max-w-md rounded-md border-2 border-line bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-terracotta"
            />
            <div className="mt-3 rounded-md bg-white border border-terracotta/40 p-3 flex items-start gap-2">
              <span className="text-terracotta text-base leading-none shrink-0">⚠</span>
              <p className="text-[11.5px] text-body leading-snug m-0">
                <strong className="text-terracotta">Attenzione: una volta confermato il nome non sarà più modificabile.</strong>
                {' '}Apparirà sul certificato stampabile e sul tuo profilo LinkedIn esattamente come scritto qui.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmedName(true)}
              disabled={!nomeOk}
              className="mt-3 rounded-md bg-terracotta text-white px-4 py-2 text-sm font-bold disabled:bg-line disabled:text-muted disabled:cursor-not-allowed"
            >
              Conferma il nome e prosegui
            </button>
            {!nomeOk && nome.length > 0 && (
              <p className="text-[11px] text-terracotta mt-2 m-0">Inserisci nome e cognome (almeno 3 caratteri, con uno spazio).</p>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2 rounded-md bg-white border-2 border-terracotta px-3 py-2 text-sm font-bold text-ink">
              <span className="text-[#6fa28b]">✓</span>
              {trimmedNome}
            </span>
            <span className="text-[11px] text-muted">Nome bloccato per il certificato.</span>
          </div>
        )}
      </div>

      <ol className={`space-y-7 m-0 p-0 list-none transition-opacity ${confirmedName ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        {domande.map((d, qi) => {
          const myAnswer = answers[qi];
          return (
            <li key={qi}>
              <div className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-1">
                Modulo {d.modulo}
              </div>
              <div className="font-serif font-bold text-base text-ink mb-3">
                {qi + 1}. {d.domanda}
              </div>
              <div className="grid gap-2">
                {d.opzioni.map((opt, oi) => {
                  const isMine = myAnswer === oi;
                  const isCorrect = d.corretta === oi;
                  const showRight = submitted && isCorrect;
                  const showWrong = submitted && isMine && !isCorrect;
                  let cls = 'border border-line bg-white text-body hover:border-terracotta hover:bg-cream-panel cursor-pointer';
                  if (showRight) cls = 'border-2 border-[#6fa28b] bg-[#f0ebda] text-ink font-semibold';
                  else if (showWrong) cls = 'border-2 border-terracotta bg-[#fef5ee] text-ink';
                  else if (isMine) cls = 'border-2 border-terracotta bg-cream-panel text-ink font-medium';
                  return (
                    <label key={oi} className={`flex gap-3 items-start rounded-md p-3 text-sm transition-colors ${cls}`}>
                      <input
                        type="radio"
                        name={`cert-q-${qi}`}
                        className="mt-0.5 accent-terracotta"
                        checked={isMine}
                        disabled={submitted}
                        onChange={() => {
                          if (submitted) return;
                          setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)));
                        }}
                      />
                      <span className="flex-1">{opt}</span>
                      {showRight && <span className="text-[#6fa28b] font-bold shrink-0">✓</span>}
                      {showWrong && <span className="text-terracotta font-bold shrink-0">✕</span>}
                    </label>
                  );
                })}
              </div>
              {submitted && d.spiega && (
                <p className="mt-2 text-xs text-muted italic m-0">{d.spiega}</p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-7 pt-5 border-t border-line">
        {!submitted ? (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs text-muted">
              {!confirmedName
                ? 'Conferma prima il nome qui sopra.'
                : allAnswered
                  ? 'Pronto a verificare?'
                  : `Rispondi a tutte (${answers.filter((a) => a !== null).length}/${domande.length})`}
            </div>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!confirmedName || !allAnswered}
              className="rounded-md bg-terracotta text-white px-5 py-2.5 text-sm font-bold disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-colors"
            >
              Verifica certificazione
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-sm text-ink">
              ✕ <strong className="text-terracotta">{correctCount}/{domande.length}</strong>.
              Serve {passaCon}/{domande.length} per ottenere la certificazione.
              <span className="block text-xs text-muted mt-1">Rivedi i moduli con risposte sbagliate e riprova. Il nome resta lo stesso.</span>
            </div>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-md bg-ink text-cream px-5 py-2.5 text-sm font-bold hover:bg-terracotta transition-colors"
            >
              Riprova
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Renders the issued certificate card + LinkedIn + download CTAs. Reads the
 * canonical name + timestamp from the gems store (not from input state), so
 * a fresh visit to the page after passing shows the same record.
 */
function PassedView({
  cert,
  totale,
  justEarned,
}: { cert: CertRecord; totale: number; justEarned: boolean }) {
  const issued = new Date(cert.passedAt);
  const dataIt = issued.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  const oraIt = issued.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const onDownload = async () => {
    setDownloadError(null);
    setDownloading(true);
    try {
      await downloadCertificatePng({ ...cert, totale, dataIt, oraIt });
    } catch (e) {
      setDownloadError(e instanceof Error ? e.message : 'Errore durante il download.');
    } finally {
      setDownloading(false);
    }
  };

  const onPrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="my-10 space-y-5">
      <section
        id="cert-printable"
        className="cert-printable rounded-xl border-2 border-terracotta bg-white p-8 shadow-md text-center"
      >
        <div className="flex justify-center mb-3">
          <ClaudeStar size={64} />
        </div>
        <div className="text-[11px] uppercase tracking-widest text-terracotta font-bold mb-1">Certificato</div>
        <h2 className="font-serif text-3xl font-bold text-ink mt-1 mb-1">Claude per Avvocati</h2>
        <p className="text-[11px] uppercase tracking-widest text-muted m-0 mb-5">Certificazione professionale</p>

        <p className="text-sm text-muted m-0 mb-1">Si attesta che</p>
        <p className="font-serif text-2xl font-bold text-ink m-0 mb-1">{cert.nome}</p>
        <p className="text-sm text-muted m-0 mb-6 max-w-md mx-auto leading-snug">
          ha superato la prova finale del corso <em>Claude per Avvocati</em>, dimostrando
          padronanza dell&apos;uso professionale di Claude nello studio legale.
        </p>

        <div className="inline-block bg-cream-panel rounded-md px-5 py-3 mb-6">
          <div className="text-3xl font-serif font-bold text-terracotta tabular-nums">{cert.punteggio}/{totale}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted mt-1">Punteggio finale</div>
        </div>

        {/* Signature + issue date footer. Two columns so it reads like a
            formal diploma: left = issuing signature, right = date/time. */}
        <div className="mt-6 pt-6 border-t border-line grid grid-cols-2 gap-6 text-center items-end">
          <div>
            <Signature />
            <div className="mt-1 text-[10px] uppercase tracking-widest text-muted">Firma</div>
            <div className="text-[11px] text-ink font-semibold">Alessio · Claude per Avvocati</div>
          </div>
          <div className="text-right">
            <div className="font-serif text-base text-ink tabular-nums">{dataIt}</div>
            <div className="text-[11px] text-muted tabular-nums">ore {oraIt}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted mt-1">Data del superamento</div>
          </div>
        </div>

        {justEarned && (
          <div className="mt-5 text-terracotta font-bold text-sm cert-no-print">+50 ✦ guadagnati!</div>
        )}
      </section>

      <div className="cert-no-print">
        <ShareAndDownload
          punteggio={cert.punteggio}
          totale={totale}
          onDownload={onDownload}
          onPrint={onPrint}
          downloading={downloading}
        />
        {downloadError && (
          <p className="text-center text-[11px] text-terracotta mt-2">{downloadError}</p>
        )}
      </div>
    </div>
  );
}

/** Stylised signature mark — handwritten-feeling SVG so the cert reads like
 *  it was actually signed, not auto-generated. */
function Signature() {
  return (
    <svg
      width="140"
      height="36"
      viewBox="0 0 140 36"
      aria-hidden
      className="mx-auto"
    >
      <path
        d="M 6 26 Q 14 6 22 22 Q 26 30 30 18 Q 34 8 40 22 Q 46 30 52 14 Q 58 4 64 24 Q 70 32 78 16 Q 84 8 90 22 Q 96 30 104 14 Q 112 6 122 22 L 132 18"
        stroke="#1a1714"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 28 28 L 128 28"
        stroke="#1a1714"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

/**
 * Three CTAs after passing the certification:
 *  1. Download (browser print-to-PDF, scoped to the certificate card via print CSS).
 *  2. LinkedIn "Add to profile" — opens LinkedIn's official wizard.
 *  3. LinkedIn "Share a post" — opens LinkedIn's share dialog with prefilled text.
 */
function ShareAndDownload({
  punteggio,
  totale,
  onDownload,
  onPrint,
  downloading,
}: {
  punteggio: number;
  totale: number;
  onDownload: () => void;
  onPrint: () => void;
  downloading: boolean;
}) {
  const ORG_NAME = 'Claude per Avvocati';
  const CERT_NAME = 'Claude per Avvocati, Certificazione';
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const courseUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/corso/certificazione` : '/corso/certificazione';

  const addToProfileUrl = new URL('https://www.linkedin.com/profile/add');
  addToProfileUrl.searchParams.set('startTask', 'CERTIFICATION_NAME');
  addToProfileUrl.searchParams.set('name', CERT_NAME);
  addToProfileUrl.searchParams.set('organizationName', ORG_NAME);
  addToProfileUrl.searchParams.set('issueYear', String(year));
  addToProfileUrl.searchParams.set('issueMonth', String(month));
  addToProfileUrl.searchParams.set('certUrl', courseUrl);

  const sharePostText = `Ho appena ottenuto la certificazione "${CERT_NAME}" con punteggio ${punteggio}/${totale}.\n\nUn corso pratico su come uno studio legale può usare Claude per email, pareri, contratti, ricerca giurisprudenziale e workflow automatizzati, senza compromettere privacy e deontologia.`;
  const sharePostUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(courseUrl)}&text=${encodeURIComponent(sharePostText)}`;

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        type="button"
        onClick={onDownload}
        disabled={downloading}
        className="inline-flex items-center gap-2 rounded-md bg-terracotta text-white px-4 py-2.5 text-sm font-bold hover:bg-terracotta/90 disabled:opacity-70 disabled:cursor-wait transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {downloading ? 'Preparo il file…' : 'Scarica il certificato (PNG)'}
      </button>
      <button
        type="button"
        onClick={onPrint}
        className="inline-flex items-center gap-2 rounded-md border border-line bg-white text-ink px-4 py-2.5 text-sm font-bold hover:border-terracotta hover:text-terracotta transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        Stampa
      </button>
      <a
        href={addToProfileUrl.toString()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-[#0a66c2] text-white px-4 py-2.5 text-sm font-bold hover:bg-[#004182] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3v9zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
        </svg>
        Aggiungi al profilo LinkedIn
      </a>
      <a
        href={sharePostUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md border-2 border-[#0a66c2] text-[#0a66c2] px-4 py-2.5 text-sm font-bold hover:bg-[#0a66c2] hover:text-white transition-colors"
      >
        Condividi un post
      </a>
    </div>
  );
}

/* ----------------------------------------------------------------------- *
 * Certificate PNG download
 *
 * Renders the certificate as a fully self-contained SVG (only system fonts,
 * no external assets), rasterises to canvas at 2× resolution, then triggers
 * a real <a download> file download. No print dialog, no PDF lib.
 * ----------------------------------------------------------------------- */

interface CertSvgData {
  nome: string;
  punteggio: number;
  totale: number;
  dataIt: string;
  oraIt: string;
}

async function downloadCertificatePng(data: CertSvgData): Promise<void> {
  const svgMarkup = buildCertificateSvg(data);
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.decoding = 'sync';
  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Impossibile generare il certificato. Riprova.'));
      img.src = svgUrl;
    });

    const scale = 2; // retina-quality output
    const canvas = document.createElement('canvas');
    canvas.width = 1200 * scale;
    canvas.height = 800 * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Il tuo browser non supporta il rendering del certificato.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png');
    });
    if (!blob) throw new Error('Errore durante la creazione del PNG.');

    const a = document.createElement('a');
    const fileNome = data.nome.replace(/\s+/g, '-').replace(/[^A-Za-z0-9-]/g, '');
    const blobUrl = URL.createObjectURL(blob);
    a.href = blobUrl;
    a.download = `Certificato-Claude-per-Avvocati-${fileNome || 'allievo'}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Defer revoke so the browser has time to start the download.
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildCertificateSvg({ nome, punteggio, totale, dataIt, oraIt }: CertSvgData): string {
  const safeName = escapeXml(nome);
  const safeData = escapeXml(dataIt);
  const safeOra = escapeXml(oraIt);
  const serif = "'Newsreader','Georgia','Times New Roman',serif";
  const sans = "system-ui,-apple-system,'Segoe UI','Inter',Arial,sans-serif";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <!-- Background -->
  <rect width="1200" height="800" fill="#ffffff"/>

  <!-- Double terracotta frame -->
  <rect x="30" y="30" width="1140" height="740" fill="none" stroke="#d97757" stroke-width="6"/>
  <rect x="50" y="50" width="1100" height="700" fill="none" stroke="#d97757" stroke-width="1.5" opacity="0.6"/>

  <!-- ClaudeStar mark -->
  <g transform="translate(600 145)">
    <path d="M 0 -56 L 16 -16 L 56 0 L 16 16 L 0 56 L -16 16 L -56 0 L -16 -16 Z" fill="#d97757"/>
    <path d="M 0 -28 L 8 -8 L 28 0 L 8 8 L 0 28 L -8 8 L -28 0 L -8 -8 Z" fill="#ffffff" opacity="0.85"/>
  </g>

  <!-- "Certificato" label -->
  <text x="600" y="245" text-anchor="middle" font-family="${sans}" font-size="14" font-weight="700" letter-spacing="4" fill="#d97757">CERTIFICATO</text>

  <!-- Title -->
  <text x="600" y="295" text-anchor="middle" font-family="${serif}" font-size="48" font-weight="700" fill="#1a1714">Claude per Avvocati</text>

  <!-- Subtitle -->
  <text x="600" y="325" text-anchor="middle" font-family="${sans}" font-size="12" font-weight="600" letter-spacing="3" fill="#6b6055">CERTIFICAZIONE PROFESSIONALE</text>

  <!-- Si attesta che -->
  <text x="600" y="395" text-anchor="middle" font-family="${sans}" font-size="16" fill="#6b6055">Si attesta che</text>

  <!-- Name -->
  <text x="600" y="455" text-anchor="middle" font-family="${serif}" font-size="44" font-weight="700" fill="#1a1714">${safeName}</text>

  <!-- Description -->
  <text x="600" y="505" text-anchor="middle" font-family="${sans}" font-size="15" fill="#6b6055">ha superato la prova finale del corso Claude per Avvocati,</text>
  <text x="600" y="528" text-anchor="middle" font-family="${sans}" font-size="15" fill="#6b6055">dimostrando padronanza dell'uso professionale di Claude nello studio legale.</text>

  <!-- Score box -->
  <rect x="500" y="560" width="200" height="80" rx="6" fill="#f4ebde"/>
  <text x="600" y="603" text-anchor="middle" font-family="${serif}" font-size="36" font-weight="700" fill="#d97757">${punteggio}/${totale}</text>
  <text x="600" y="625" text-anchor="middle" font-family="${sans}" font-size="10" font-weight="600" letter-spacing="2" fill="#6b6055">PUNTEGGIO FINALE</text>

  <!-- Divider -->
  <line x1="180" y1="685" x2="1020" y2="685" stroke="#e8dec9" stroke-width="1"/>

  <!-- Signature (left) -->
  <g transform="translate(300 720)">
    <path d="M -90 4 Q -78 -22 -64 0 Q -58 12 -50 -8 Q -40 -22 -28 2 Q -18 14 -8 -10 Q 4 -22 14 4 Q 24 18 36 -6 Q 48 -18 58 4 Q 70 18 84 -8 Q 94 -16 100 4" stroke="#1a1714" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="-90" y1="22" x2="100" y2="22" stroke="#1a1714" stroke-width="0.6" opacity="0.35"/>
  </g>
  <text x="300" y="765" text-anchor="middle" font-family="${sans}" font-size="9" font-weight="700" letter-spacing="2" fill="#6b6055">FIRMA</text>
  <text x="300" y="782" text-anchor="middle" font-family="${sans}" font-size="13" font-weight="600" fill="#1a1714">Alessio · Claude per Avvocati</text>

  <!-- Date (right) -->
  <text x="900" y="720" text-anchor="middle" font-family="${serif}" font-size="20" fill="#1a1714">${safeData}</text>
  <text x="900" y="745" text-anchor="middle" font-family="${sans}" font-size="13" fill="#6b6055">ore ${safeOra}</text>
  <text x="900" y="772" text-anchor="middle" font-family="${sans}" font-size="9" font-weight="700" letter-spacing="2" fill="#6b6055">DATA DEL SUPERAMENTO</text>
</svg>`;
}
