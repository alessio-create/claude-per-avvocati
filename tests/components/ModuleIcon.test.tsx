import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ModuleIcon } from '../../components/illustration/ModuleIcon';

describe('ModuleIcon', () => {
 it('renders all six variants without crashing', () => {
  const names = ['fondamenta', 'surfaces', 'setup', 'legal', 'skills', 'privacy'] as const;
  for (const n of names) {
   const html = renderToStaticMarkup(<ModuleIcon name={n} />);
   expect(html).toContain('<svg');
  }
 });

 it('respects color prop', () => {
  const html = renderToStaticMarkup(<ModuleIcon name="fondamenta" color="#ff0000" />);
  expect(html).toContain('#ff0000');
 });

 it('respects size prop', () => {
  const html = renderToStaticMarkup(<ModuleIcon name="surfaces" size={100} />);
  expect(html).toContain('width="100"');
 });
});
