import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseCart,
  serializeCart,
  setCartQuantity,
  cartTotalMinor,
} from '../src/lib/cart-state.ts';
const products = [
  { key: 'digital:100', priceMinor: 900, maxQuantity: 1 },
  { key: 'physical:bat-skeleton', priceMinor: 3000, maxQuantity: 99 },
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
        JSON.stringify({ version: 1, items: [{ key: 'physical:bat-skeleton', quantity }] }),
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
test('Duplicate downloads are merged and physical quantities stay bounded', () => {
  const raw = JSON.stringify({
    version: 1,
    items: [
      { key: 'digital:100', quantity: 1 },
      { key: 'digital:100', quantity: 1 },
      { key: 'physical:bat-skeleton', quantity: 80 },
      { key: 'physical:bat-skeleton', quantity: 40 },
    ],
  });
  assert.deepEqual(parseCart(raw, products), [
    { key: 'digital:100', quantity: 1 },
    { key: 'physical:bat-skeleton', quantity: 99 },
  ]);
});
test('Add, change and remove keep exact integer-cent totals', () => {
  let items = setCartQuantity([], 'digital:100', 1, products);
  items = setCartQuantity(items, 'physical:bat-skeleton', 2, products);
  assert.equal(cartTotalMinor(items, products), 6900);
  assert.deepEqual(parseCart(serializeCart(items), products), items);
  assert.deepEqual(setCartQuantity(items, 'digital:100', 2, products), items);
  assert.deepEqual(setCartQuantity(items, 'unknown', 1, products), items);
  items = setCartQuantity(items, 'digital:100', 0, products);
  assert.equal(cartTotalMinor(items, products), 6000);
  assert.deepEqual(setCartQuantity(items, 'physical:bat-skeleton', 0, products), []);
});
