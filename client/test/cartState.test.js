import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CART_STORAGE_KEY, appendCartLine, cartKey, emptyCart, itemBranch, prepareReorder, readCart, refreshCartPricing, validateCart, writeCart } from '../src/services/cartState.js';
import { customerReturnPath, normalizeDigits } from '../src/services/customerNavigation.js';

const branchId = '111111111111111111111111';
const itemId = '222222222222222222222222';
const otherBranch = '333333333333333333333333';
const line = (extra = {}) => ({ itemId, branchId, name: 'Fish', unit: 'half', unitPrice: 210, quantity: 2, addOns: ['Sauce'], notes: 'No salt', image: '/images/menu/placeholder.jpg', ...extra });
const currentItem = (extra = {}) => ({ _id: itemId, name: 'Fresh fish', branches: [{ _id: branchId }], isAvailable: true, weightPrices: [{ unit: 'half', price: 220 }], addOns: [{ name: 'Sauce', price: 15 }], ...extra });
const previous = (extra = {}) => ({ item: currentItem(), name: 'Fish', unit: 'half', unitPrice: 210, quantity: 2, addOns: [{ name: 'Sauce', price: 10 }], notes: 'No salt', ...extra });

test('a saved cart survives reload while malformed, unsupported and inaccessible storage falls back safely', () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
  const cart = { branchId, items: [line({ unexpected: 'discard' })] };
  assert.equal(writeCart(storage, cart), true);
  assert.deepEqual(readCart(storage), { branchId, items: [line()] });
  for (const value of ['broken JSON', JSON.stringify({ version: 99, cart }), JSON.stringify({ version: 1, cart: { ...cart, items: [line({ quantity: -1 })] } })]) {
    values.set(CART_STORAGE_KEY, value);
    assert.deepEqual(readCart(storage), emptyCart());
  }
  const unavailableStorage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('full'); } };
  assert.deepEqual(readCart(unavailableStorage), emptyCart());
  assert.equal(writeCart(unavailableStorage, cart), false);
});

test('cart validation rejects mixed branches and invalid quantities, prices, units and notes', () => {
  for (const extra of [{ branchId: otherBranch }, { quantity: 101 }, { quantity: 1.5 }, { unitPrice: Infinity }, { unitPrice: -1 }, { unit: 'invalid' }, { notes: 'x'.repeat(251) }]) {
    assert.throws(() => validateCart({ branchId, items: [line(extra)] }));
  }
  assert.equal(validateCart({ branchId, items: [line({ image: 'javascript:bad' })] }).items[0].image, '');
});

test('identical selections merge but distinct cooking notes remain separate cart lines', () => {
  const original = [line()];
  const merged = appendCartLine(original, line({ quantity: 1, unitPrice: 235 }));
  assert.equal(merged[0].quantity, 3);
  assert.equal(merged[0].unitPrice, 235);
  assert.equal(original[0].quantity, 2);
  assert.equal(appendCartLine(original, line({ notes: 'Extra salt' })).length, 2);
  assert.equal(cartKey(line({ addOns: ['Sauce', 'Lemon'], notes: ' No salt ' })), cartKey(line({ addOns: ['Lemon', 'Sauce'] })));
  assert.throws(() => appendCartLine([line({ quantity: 100 })], line({ quantity: 1 })));
});

test('reorder uses current weight and add-on prices without modifying the historical order', () => {
  const order = { branch: { _id: branchId }, items: [previous()] };
  const snapshot = structuredClone(order);
  const result = prepareReorder(order);
  assert.equal(result.cart.items[0].unitPrice, 235);
  assert.equal(result.cart.items[0].quantity, 2);
  assert.equal(result.cart.items[0].notes, 'No salt');
  assert.equal(result.pricesChanged, true);
  assert.deepEqual(order, snapshot);
});

test('reorder skips removed items, sizes, add-ons and branch assignments; an entirely unavailable order cannot replace the cart', () => {
  const unavailable = [null, currentItem({ isAvailable: false }), currentItem({ branches: [otherBranch] }), currentItem({ weightPrices: [{ unit: 'kilo', price: 400 }] }), currentItem({ addOns: [] })];
  const result = prepareReorder({ branch: branchId, items: [previous(), ...unavailable.map((item, i) => previous({ item, name: `Removed ${i}` }))] });
  assert.equal(result.cart.items.length, 1);
  assert.equal(result.unavailable.length, unavailable.length);
  assert.throws(() => prepareReorder({ branch: branchId, items: unavailable.map((item) => previous({ item })) }));
  assert.throws(() => prepareReorder({ branch: null, items: [previous()] }));
});

test('checkout refresh detects persisted price changes and unavailable choices using the current branch catalog', () => {
  const cart = { branchId, items: [line(), line({ itemId: '444444444444444444444444', name: 'Removed item' })] };
  const result = refreshCartPricing(cart, [currentItem()]);
  assert.equal(result.cart.items[0].unitPrice, 235);
  assert.equal(result.pricesChanged, true);
  assert.deepEqual(result.unavailable, ['Removed item']);
  assert.equal(cart.items.length, 2);
  const unchanged = refreshCartPricing({ branchId, items: [line({ unitPrice: 235 })] }, [currentItem()]);
  assert.equal(unchanged.pricesChanged, false);
});

test('quick add keeps the selected branch when an item belongs to multiple branches', () => {
  assert.equal(itemBranch({ branches: [{ _id: otherBranch }, { _id: branchId }] }, branchId)._id, branchId);
  assert.equal(itemBranch({ branches: [otherBranch, branchId] }, branchId), branchId);
});

test('customer sign-in returns to customer pages and accepts Arabic and Persian digits', () => {
  for (const path of ['/cart', `/track/${itemId}`, '/menu?branch=nasr']) assert.equal(customerReturnPath(path), path);
  for (const path of [null, 'https://outside.example', '//outside.example', '/\\outside.example', '/admin', '/admin/orders', '/admin?tab=orders', '/cart\n']) assert.equal(customerReturnPath(path), '/account');
  assert.equal(normalizeDigits('٠١٠۱۲۳۴۵۶۷۸'), '01012345678');
});
