import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseCart,
  serializeCart,
  setCartQuantity,
  cartTotalMinor,
  normalisePromoCode,
  promoDiscountMinor,
} from '../src/lib/cart-state.ts';
const products = [
  { key: 'digital:100', priceMinor: 900, maxQuantity: 1 },
  { key: 'sample:multi', priceMinor: 3000, maxQuantity: 99 },
];

test('Cart storage ignores injected prices and unknown products', () => {
  const items = parseCart(
    JSON.stringify({
      version: 1,
      items: [
        { key: 'digital:100', quantity: 1, priceMinor: 1, title: '<script>' },
        { key: 'unknown', quantity: 1 },
      ],
    }),
    products,
  );
  assert.deepEqual(items, [{ key: 'digital:100', quantity: 1 }]);
  assert.equal(cartTotalMinor(items, products), 900);
});
test('Malformed, oversized and unsupported storage cannot become a cart', () => {
  for (const raw of [
    null,
    'bad JSON',
    'null',
    '[]',
    'x'.repeat(10001),
    JSON.stringify({ version: 2, items: [] }),
    JSON.stringify({ version: 1, items: {} }),
    JSON.stringify({ version: 1, items: Array(101).fill({ key: 'digital:100', quantity: 1 }) }),
  ])
    assert.deepEqual(parseCart(raw, products), []);
});
test('Invalid quantities and non-object rows are discarded', () => {
  for (const quantity of [-1, 0, 1.5, '1', null, 100, Number.MAX_SAFE_INTEGER])
    assert.deepEqual(
      parseCart(
        JSON.stringify({ version: 1, items: [{ key: 'sample:multi', quantity }] }),
        products,
      ),
      [],
    );
  assert.deepEqual(
    parseCart(
      JSON.stringify({
        version: 1,
        items: [null, 'digital:100', {}, { key: '__proto__', quantity: 1 }],
      }),
      products,
    ),
    [],
  );
});
test('Duplicate downloads are merged and multi-quantity items stay bounded', () => {
  const raw = JSON.stringify({
    version: 1,
    items: [
      { key: 'digital:100', quantity: 1 },
      { key: 'digital:100', quantity: 1 },
      { key: 'sample:multi', quantity: 80 },
      { key: 'sample:multi', quantity: 40 },
    ],
  });
  assert.deepEqual(parseCart(raw, products), [
    { key: 'digital:100', quantity: 1 },
    { key: 'sample:multi', quantity: 99 },
  ]);
});
test('Add, change and remove keep exact integer-cent totals', () => {
  let items = setCartQuantity([], 'digital:100', 1, products);
  items = setCartQuantity(items, 'sample:multi', 2, products);
  assert.equal(cartTotalMinor(items, products), 6900);
  assert.deepEqual(parseCart(serializeCart(items), products), items);
  assert.deepEqual(setCartQuantity(items, 'digital:100', 2, products), items);
  assert.deepEqual(setCartQuantity(items, 'unknown', 1, products), items);
  items = setCartQuantity(items, 'digital:100', 0, products);
  assert.equal(cartTotalMinor(items, products), 6000);
  assert.deepEqual(setCartQuantity(items, 'sample:multi', 0, products), []);
});
test('Demo promo codes are validated and round the discount down', () => {
  assert.equal(normalisePromoCode(' visamore10 '), 'VISAMORE10');
  assert.equal(normalisePromoCode('FREE100'), null);
  assert.equal(normalisePromoCode('__proto__'), null);
  assert.equal(normalisePromoCode(null), null);
  assert.equal(promoDiscountMinor(1199, 'VISAMORE10'), 119);
  assert.equal(promoDiscountMinor(1199, null), 0);
  assert.equal(promoDiscountMinor(0, 'VISAMORE10'), 0);
  assert.equal(promoDiscountMinor(1199, 'UNKNOWN'), 0);
});
