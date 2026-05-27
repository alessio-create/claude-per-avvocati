'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { ChatBotAvatar } from '../illustration/ChatBotAvatar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'cpa_chat_v1';
const HINT_DISMISSED_KEY = 'cpa_chat_hint_dismissed_v1';
const INITIAL_GREETING: Message = {
  role: 'assistant',
  content:
    'Ciao! Sono l\'assistente di Claude per Avvocati. Chiedimi quello che vuoi sul corso: programma, prezzi, certificazione, accesso ai moduli. Come posso aiutarti?',
};

/**
  * Floating chatbot in the bottom-right corner. Streams responses from /api/chat.
  * Messages persist in localStorage so the conversation survives page navigation
  * across the marketing site.
  */
export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [hideForScroll, setHideForScroll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const onCoursePage = pathname?.startsWith('/corso') ?? false;

  // On course pages, hide the launcher once the reader scrolls past 90% of
  // the page so it stops covering the lesson nav. Reappears as soon as the
  // reader scrolls back up. Disabled outside /corso.
  useEffect(() => {
    if (!onCoursePage) {
      setHideForScroll(false);
      return;
    }
    const handle = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY + window.innerHeight;
      const total = doc.scrollHeight;
      // Avoid divide-by-zero on tiny pages, never hide if there's nothing to scroll.
      if (total <= window.innerHeight + 50) {
        setHideForScroll(false);
        return;
      }
      setHideForScroll(scrolled / total >= 0.9);
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, [onCoursePage, pathname]);

  // Show the attention hint bubble after a short idle delay,
  // unless the user has dismissed it before.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (localStorage.getItem(HINT_DISMISSED_KEY) === '1') return;
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setHintVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  function dismissHint() {
    setHintVisible(false);
    try {
      localStorage.setItem(HINT_DISMISSED_KEY, '1');
    } catch {
      /* ignore */
    }
  }

  // Restore conversation
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {
      /* ignore parse errors, keep greeting */
    }
  }, []);

  // Persist conversation
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* localStorage quota, ignore */
    }
  }, [messages]);

  // Auto-scroll to bottom on new content
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, streaming]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setStreaming(true);

    // Add an empty assistant message to stream into
    setMessages([...next, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });

      if (!response.ok || !response.body) {
        const errorBody = await response.json().catch(() => ({}));
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role !== 'assistant') return prev;
          return [
            ...prev.slice(0, -1),
            {
              role: 'assistant',
              content:
                errorBody.error ||
                'Errore nel contattare il server. Riprova fra qualche istante.',
            },
          ];
        });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role !== 'assistant') return prev;
          return [...prev.slice(0, -1), { role: 'assistant', content: acc }];
        });
      }
    } catch {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role !== 'assistant' || last.content) return prev;
        return [
          ...prev.slice(0, -1),
          {
            role: 'assistant',
            content: 'Errore di rete. Riprova fra qualche istante.',
          },
        ];
      });
    } finally {
      setStreaming(false);
    }
  }

  function clear() {
    setMessages([INITIAL_GREETING]);
  }

  return (
    <>
      {/* Floating launcher: pill on desktop with attention label, circle on mobile with hint bubble.
          On /corso pages it fades out once the reader is past 90% of the page so it doesn't cover
          the LessonNav at the bottom. */}
      {!open && (
        <div
          aria-hidden={hideForScroll || undefined}
          className={`fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end gap-2 transition-[opacity,transform] duration-300 ease-out ${
            hideForScroll
              ? 'opacity-0 translate-y-3 pointer-events-none'
              : 'opacity-100 translate-y-0 pointer-events-auto'
          }`}
          style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          {/* Attention hint bubble (mobile only, where the pill label is hidden) */}
          {hintVisible && (
            <div className="sm:hidden relative bg-white border border-line shadow-lg rounded-2xl rounded-br-sm px-3 py-2 max-w-[200px] anim-rise">
              <button
                type="button"
                onClick={dismissHint}
                aria-label="Chiudi suggerimento"
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ink text-cream text-[10px] leading-none flex items-center justify-center shadow"
              >
                ×
              </button>
              <div className="text-[11px] font-semibold text-ink leading-tight">Posso aiutarti?</div>
              <div className="text-[10px] text-muted leading-tight mt-0.5">Chiedi del corso, dei prezzi, dei moduli.</div>
            </div>
          )}

          <button
            type="button"
            onClick={() => { setOpen(true); dismissHint(); }}
            aria-label="Apri assistente del corso"
            className="
              group relative flex items-center gap-2.5 rounded-full shadow-xl bg-terracotta text-white
              transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-2xl
              pl-1 pr-1 py-1
              sm:pl-1.5 sm:pr-4 sm:py-1.5
            "
          >
            {/* Avatar in inner circle — solid cream backdrop so the character pops on the terracotta pill */}
            <span className="relative inline-flex w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-cream ring-2 ring-white shadow-inner items-center justify-center shrink-0 overflow-hidden">
              <ChatBotAvatar size={34} className="sm:hidden" />
              <ChatBotAvatar size={38} className="hidden sm:block" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#6fa28b] border-2 border-terracotta" />
            </span>

            {/* Text label, only on desktop */}
            <span className="hidden sm:flex flex-col items-start leading-tight pr-1">
              <span className="text-[12px] font-bold tracking-tight">Chiedi a Claude</span>
              <span className="text-[9.5px] text-white/85 font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#a8f0cf] anim-pulse-dot" />
                Risponde in secondi
              </span>
            </span>
          </button>
        </div>
      )}

      {/* Chat panel — full-width sheet on mobile, floating card on desktop */}
      {open && (
        <div
          className="fixed z-50 bg-white border border-line shadow-2xl flex flex-col overflow-hidden
            inset-x-2 bottom-2 top-16 rounded-2xl
            sm:inset-auto sm:bottom-5 sm:right-5 sm:top-auto sm:w-[360px] sm:max-w-[calc(100vw-2.5rem)] sm:h-[540px] sm:max-h-[calc(100vh-2.5rem)]"
          style={{ bottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        >
          {/* Header */}
          <header className="flex items-center gap-3 px-4 py-3 bg-ink text-cream border-b border-[#2e2922]">
            <div className="w-9 h-9 rounded-full bg-cream ring-1 ring-white/30 flex items-center justify-center shrink-0 overflow-hidden">
              <ChatBotAvatar size={34} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold leading-tight">Assistente del corso</div>
              <div className="text-[10px] text-muted leading-tight">Powered by Claude · risposte in italiano</div>
            </div>
            <button
              type="button"
              onClick={clear}
              className="text-[10px] text-muted hover:text-cream"
              title="Cancella conversazione"
            >
              reset
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Chiudi chat"
              className="w-7 h-7 rounded-md text-cream/70 hover:text-cream hover:bg-[#2e2922] flex items-center justify-center text-lg leading-none"
            >
              ×
            </button>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-cream-panel">
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} />
            ))}
            {streaming && messages[messages.length - 1]?.content === '' && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-cream shrink-0 flex items-center justify-center overflow-hidden">
                  <ChatBotAvatar size={24} />
                </div>
                <div className="bg-white border border-line rounded-2xl rounded-tl-sm px-3 py-2 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={send} className="border-t border-line bg-white p-3 flex gap-2 items-end">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(e as unknown as FormEvent);
                }
              }}
              placeholder="Scrivi una domanda…"
              disabled={streaming}
              className="flex-1 resize-none border border-line rounded-md px-3 py-2 text-sm bg-cream-panel focus:bg-white focus:border-terracotta outline-none max-h-32"
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="rounded-md bg-terracotta text-white px-3.5 py-2 text-sm font-bold disabled:bg-line disabled:text-muted disabled:cursor-not-allowed shrink-0"
            >
              Invia
            </button>
          </form>
        </div>
      )}
    </>
  );
}

/**
  * Renders a message bubble. For assistant messages, auto-links any /corso/...
  * or other relative URLs found in the text so users can click directly.
  */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-cream shrink-0 flex items-center justify-center overflow-hidden">
          <ChatBotAvatar size={24} />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-snug whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-terracotta text-white rounded-tr-sm'
            : 'bg-white border border-line text-body rounded-tl-sm'
        }`}
      >
        {isUser ? message.content : <LinkifiedText text={message.content} />}
      </div>
    </div>
  );
}

/**
  * Auto-linkify relative URLs (starting with "/") and absolute http(s) URLs.
  * Keeps things simple, no markdown parsing.
  */
function LinkifiedText({ text }: { text: string }) {
  const urlRegex = /(https?:\/\/[^\s)]+|\/[a-zA-Z0-9_\-./?=&#%]+)/g;
  const parts: (string | { url: string })[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push({ url: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <span key={i}>{p}</span>
        ) : (
          <a
            key={i}
            href={p.url}
            className="text-terracotta font-semibold hover:underline break-all"
            target={p.url.startsWith('http') ? '_blank' : undefined}
            rel={p.url.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {p.url}
          </a>
        ),
      )}
    </>
  );
}
