import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ClaudeStar } from '../../components/illustration/ClaudeStar';

describe('ClaudeStar', () => {
 it('renders terracotta 8-pointed star at given size', () => {
  const html = renderToStaticMarkup(<ClaudeStar size={32} />);
  expect(html).toContain('width="32"');
  expect(html).toContain('height="32"');
  expect(html).toContain('#d97757');
 });
});
