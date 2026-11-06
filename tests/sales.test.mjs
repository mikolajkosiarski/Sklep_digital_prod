import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readSalesSnapshot } from '../src/lib/sales.ts';

const readJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const evidence = readJson('../src/data/etsy-sales-all-time.json');
const catalog = readJson('../src/data/shop-content.json');

test('The dated Etsy snapshot reports transactions, not listing renewals', () => {
  const { counts, note } = readSalesSnapshot(evidence);
  assert.equal(evidence.products.length, 10);
  assert.deepEqual(counts, {
    100: 265,
    30: 47,
    300: 135,
    200: 17,
    54: 14,
    110: 40,
    121: 130,
    25: 17,
    55: 44,
    20: 30,
  });
  assert.equal(evidence.products.find(({ pack }) => pack === '100').renewals, 266);
  assert.equal(evidence.products.find(({ pack }) => pack === '110').renewals, 44);
  assert.equal(note, 'All-time Etsy sales transactions per listing, as of 23 Oct 2026.');
});

test('The six catalog collections retain their evidenced counts without adding archived listings', () => {
  const { counts } = readSalesSnapshot(evidence);
  assert.deepEqual(
    catalog.digital.map(({ id }) => [id, counts[id]]),
    [
      ['100', 265],
      ['121', 130],
      ['300', 135],
      ['200', 17],
      ['55', 44],
      ['25', 17],
    ],
  );
  assert(!('physical' in catalog), 'The shop sells digital collections only.');
  for (const id of ['30', '54', '110', '20']) {
    assert(Object.hasOwn(counts, id), `Keep the original evidence for listing ${id}.`);
    assert(!catalog.digital.some((product) => product.id === id));
  }
});

test('An incompatible reporting period or metric cannot become an all-time sales claim', () => {
  for (const patch of [
    { metric: 'renewals' },
    { metric: 'revenue' },
    { period: 'last-30-days' },
    { period: '2025' },
  ]) {
    assert.throws(() => readSalesSnapshot({ ...evidence, ...patch }));
  }
});

test('Evidence dates are real ISO calendar dates and produce UTC date labels', () => {
  for (const asOf of [
    '2026-02-30',
    '2025-02-29',
    '1900-02-29',
    '2024-04-31',
    '2026-13-01',
    '2026-01-00',
    '23/10/2026',
    'not a date',
  ]) {
    assert.throws(() => readSalesSnapshot({ ...evidence, asOf }), Error, `Invalid date: ${asOf}`);
  }
  for (const [asOf, expected] of [
    ['2000-02-29', '29 Feb 2000'],
    ['2024-02-29', '29 Feb 2024'],
    ['2026-01-01', '1 Jan 2026'],
  ]) {
    assert.equal(
      readSalesSnapshot({ ...evidence, asOf }).note,
      `All-time Etsy sales transactions per listing, as of ${expected}.`,
    );
  }
});

test('Each evidence row must identify one unique numeric pack', () => {
  const row = evidence.products[0];
  assert.throws(() => readSalesSnapshot({ ...evidence, products: [...evidence.products, row] }));
  assert.throws(() => readSalesSnapshot({ ...evidence, products: {} }));
  for (const pack of ['', '100-designs', '__proto__', 100, null]) {
    assert.throws(() => readSalesSnapshot({ ...evidence, products: [{ ...row, pack }] }));
  }
});

test('Both metrics require non-negative integer counts; a supplied zero differs from missing evidence', () => {
  const row = evidence.products[0];
  for (const metric of ['transactions', 'renewals']) {
    for (const value of [-1, 2.5, '265', null, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      assert.throws(() =>
        readSalesSnapshot({ ...evidence, products: [{ ...row, [metric]: value }] }),
      );
    }
  }
  const zero = readSalesSnapshot({
    ...evidence,
    products: [{ pack: '100', transactions: 0, renewals: 0 }],
  });
  assert.equal(zero.counts['100'], 0);
  assert(Object.hasOwn(zero.counts, '100'));
  assert(!Object.hasOwn(zero.counts, '121'));
  assert.deepEqual(readSalesSnapshot({ ...evidence, products: [] }).counts, {});
});
