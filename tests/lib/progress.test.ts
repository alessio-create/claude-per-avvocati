import { describe, it, expect, beforeEach } from 'vitest';
import { getProgress, markCompleted, setLastVisited } from '../../lib/progress';

describe('progress', () => {
 beforeEach(() => {
  globalThis.localStorage = {
   _s: {} as Record<string, string>,
   getItem(k: string) { return this._s[k] ?? null; },
   setItem(k: string, v: string) { this._s[k] = v; },
   removeItem(k: string) { delete this._s[k]; },
   clear() { this._s = {}; },
   key() { return null; },
   length: 0,
  } as Storage;
 });

 it('starts empty', () => {
  expect(getProgress().completed).toEqual([]);
  expect(getProgress().lastVisited).toBeNull();
 });

 it('records completed and last visited', () => {
  markCompleted('01-fondamenta', '01-foo');
  setLastVisited('01-fondamenta', '01-foo');
  const p = getProgress();
  expect(p.completed).toContain('01-fondamenta/01-foo');
  expect(p.lastVisited).toEqual({ modulo: '01-fondamenta', lezione: '01-foo' });
 });

 it('dedupes completed', () => {
  markCompleted('01-fondamenta', '01-foo');
  markCompleted('01-fondamenta', '01-foo');
  expect(getProgress().completed).toHaveLength(1);
 });
});
