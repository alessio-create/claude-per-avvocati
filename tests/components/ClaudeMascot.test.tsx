import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ClaudeMascot } from '../../components/illustration/ClaudeMascot';

describe('ClaudeMascot', () => {
 it('renders happy variant with smile + blush', () => {
  const html = renderToStaticMarkup(<ClaudeMascot variant="happy" size={32} />);
  // smile bottom row pixels
  expect(html).toContain('x="14" y="16" width="4"');
  // blush
  expect(html).toContain('#ef9b7e');
  // no helmet for happy
  expect(html).not.toMatch(/x="5" y="7" width="1" height="6"/);
 });

 it('renders astro variant with helmet', () => {
  const html = renderToStaticMarkup(<ClaudeMascot variant="astro" size={32} />);
  expect(html).toMatch(/x="5" y="7" width="1" height="6"/);
 });

 it('renders mid variant (same as happy, no helmet/arms)', () => {
  const html = renderToStaticMarkup(<ClaudeMascot variant="mid" size={32} />);
  // mid uses same face/blush as happy
  expect(html).toContain('#ef9b7e');
  // no helmet
  expect(html).not.toMatch(/x="5" y="7" width="1" height="6"/);
  // no arms (which only astro has at x=8 and x=22, y=13)
  expect(html).not.toMatch(/x="8" y="13" width="2" height="2"/);
 });

 it('uses pixelated image-rendering', () => {
  const html = renderToStaticMarkup(<ClaudeMascot variant="happy" />);
  expect(html).toContain('pixelated');
 });
});
