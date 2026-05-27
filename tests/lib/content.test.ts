import { describe, it, expect } from 'vitest';
import { buildCorsoIndex } from '../../lib/content';
import { join } from 'node:path';

const fixturesRoot = join(__dirname, '../fixtures/content');

describe('buildCorsoIndex', () => {
 it('walks content folder, parses _module.json + MDX frontmatter, returns sorted modules', () => {
  const index = buildCorsoIndex(fixturesRoot);

  expect(index.moduli).toHaveLength(2);
  expect(index.moduli[0].slug).toBe('01-fondamenta');
  expect(index.moduli[0].titolo).toBe('Fondamenta');
  expect(index.moduli[0].coloreCover).toBe('lilac');
  expect(index.moduli[0].lezioni).toHaveLength(1);
  expect(index.moduli[0].lezioni[0].slug).toBe('01-foo');
  expect(index.moduli[0].lezioni[0].titolo).toBe('Foo');
  expect(index.moduli[0].lezioni[0].durata).toBe(5);
  expect(index.moduli[1].slug).toBe('02-altro');
 });

 it('throws on missing _module.json', () => {
  expect(() => buildCorsoIndex('/nonexistent')).toThrow();
 });
});
