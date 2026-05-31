import type { JSX } from 'react';
import { Prompt } from './Prompt';
import { PromptVariante } from './PromptVariante';
import { Nota } from './Nota';
import { Esempio } from './Esempio';
import { Checklist, CheckItem } from './Checklist';
import { Cita } from './Cita';
import { Confronto } from './Confronto';
import { RiferimentoCorso } from './RiferimentoCorso';
import { Pillari } from './Pillari';
import { Risorse } from './Risorse';
import { BarChart } from './BarChart';
import { Quiz } from './Quiz';
import { Slides, Slide } from './Slides';
import { Outcomes, Outcome } from './Outcomes';
import { Recap, Punto } from './Recap';

type MDXComponentsType = {
  [key: string]: React.ComponentType<any>;
};

export const mdxComponents: MDXComponentsType = {
  Prompt, PromptVariante, Nota, Esempio, Checklist, CheckItem, Cita, Confronto, RiferimentoCorso,
  Pillari, Risorse, BarChart, Quiz,
  Slides, Slide, Outcomes, Outcome, Recap, Punto,
  h1: (props: JSX.IntrinsicElements['h1']) => <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: JSX.IntrinsicElements['h2']) => <h2 className="font-serif text-xl sm:text-2xl font-bold mt-8 sm:mt-10 mb-3" {...props} />,
  h3: (props: JSX.IntrinsicElements['h3']) => <h3 className="font-serif text-lg sm:text-xl font-bold mt-6 sm:mt-8 mb-2" {...props} />,
  h4: (props: JSX.IntrinsicElements['h4']) => <h4 className="font-serif text-base sm:text-lg font-bold mt-5 sm:mt-6 mb-2" {...props} />,
  p: (props: JSX.IntrinsicElements['p']) => <p className="text-body leading-relaxed my-4 break-words" {...props} />,
  ul: (props: JSX.IntrinsicElements['ul']) => <ul className="list-disc pl-6 my-4 text-body space-y-1" {...props} />,
  ol: (props: JSX.IntrinsicElements['ol']) => <ol className="list-decimal pl-6 my-4 text-body space-y-1" {...props} />,
  li: (props: JSX.IntrinsicElements['li']) => <li className="leading-relaxed" {...props} />,
  code: (props: JSX.IntrinsicElements['code']) => <code className="bg-cream-panel px-1.5 py-0.5 rounded text-sm font-mono text-ink" {...props} />,
  pre: (props: JSX.IntrinsicElements['pre']) => <pre className="bg-ink text-cream p-4 rounded-md overflow-x-auto my-4 text-sm" {...props} />,
  blockquote: (props: JSX.IntrinsicElements['blockquote']) => (
    <blockquote className="my-6 border-l-4 border-terracotta bg-cream-panel pl-5 pr-4 py-3 italic text-body" {...props} />
  ),
  // GFM tables, styled inline (no @tailwindcss/typography dep)
  table: (props: JSX.IntrinsicElements['table']) => (
    <div className="my-6 overflow-x-auto rounded-md border border-line">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: JSX.IntrinsicElements['thead']) => <thead className="bg-cream-panel" {...props} />,
  tbody: (props: JSX.IntrinsicElements['tbody']) => <tbody {...props} />,
  tr: (props: JSX.IntrinsicElements['tr']) => <tr className="border-b border-line last:border-b-0" {...props} />,
  th: (props: JSX.IntrinsicElements['th']) => (
    <th className="px-4 py-2.5 text-left font-serif font-bold text-ink text-xs uppercase tracking-wider" {...props} />
  ),
  td: (props: JSX.IntrinsicElements['td']) => <td className="px-4 py-2.5 text-body align-top" {...props} />,
  // GFM extras: strikethrough, etc. handled by default <del> styling
  hr: () => <hr className="my-10 border-line" />,
  a: (props: JSX.IntrinsicElements['a']) => (
    <a className="text-terracotta hover:underline font-medium" target={props.href?.startsWith('http') ? '_blank' : undefined} rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined} {...props} />
  ),
  strong: (props: JSX.IntrinsicElements['strong']) => <strong className="text-ink font-bold" {...props} />,
};
