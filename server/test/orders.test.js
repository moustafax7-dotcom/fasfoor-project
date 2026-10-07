const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const Order = require('../src/models/Order');
const Branch = require('../src/models/Branch');
const Item = require('../src/models/Item');
const Customer = require('../src/models/Customer');
const Coupon = require('../src/models/Coupon');
const LoyaltyConfig = require('../src/models/LoyaltyConfig');
const DeliveryZone = require('../src/models/DeliveryZone');
require('../src/services/notificationService').notifyOrderStatus = async () => {};
const controller = require('../src/controllers/orderController');

const branchId = new mongoose.Types.ObjectId().toString();
const itemId = new mongoose.Types.ObjectId().toString();
const customerId = new mongoose.Types.ObjectId();
function fixtures(t) {
  const created = [];
  t.mock.method(Branch, 'findById', async () => ({ isOpen: true, minimumOrderValue: 150 }));
  t.mock.method(Item, 'findById', async () => ({ _id: itemId, name: 'Fish', price: 200, branches: [branchId], isAvailable: true, addOns: [] }));
  t.mock.method(Order, 'create', async (data) => { created.push(data); return data; });
  t.mock.method(Customer, 'findByIdAndUpdate', async () => {});
  t.mock.method(LoyaltyConfig, 'findOne', async () => null);
  return created;
}
async function submit(body, admin) {
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(data) { this.body = data; return this; } };
  const req = { body: { branch: branchId, items: [{ item: itemId, quantity: 1 }], deliveryType: 'pickup', ...body }, customer: { _id: customerId }, admin };
  await controller.createOrder(req, res, (error) => { throw error; });
  return res;
}

test('pickup ignores supplied delivery zone and client totals', async (t) => {
  const created = fixtures(t);
  t.mock.method(DeliveryZone, 'findOne', () => { throw new Error('Pickup must not query zones'); });
  const res = await submit({ deliveryZone: new mongoose.Types.ObjectId().toString(), total: 1, deliveryAddress: { fullAddress: 'ignored' } });
  assert.equal(res.statusCode, 201);
  assert.equal(created[0].deliveryFee, 0);
  assert.equal(created[0].total, 200);
  assert.equal(created[0].deliveryAddress, undefined);
});

test('delivery uses the active zone fee and requires an address', async (t) => {
  fixtures(t);
  const zoneId = new mongoose.Types.ObjectId().toString();
  t.mock.method(DeliveryZone, 'findOne', async (filter) => { assert.equal(filter.branch, branchId); assert.equal(filter.isActive, true); return { deliveryFee: 35 }; });
  const res = await submit({ deliveryType: 'delivery', deliveryAddress: { fullAddress: 'Example street' }, deliveryZone: zoneId });
  assert.equal(res.body.data.total, 235);
  assert.equal((await submit({ deliveryType: 'delivery' })).statusCode, 400);
  assert.equal((await submit({ deliveryType: 'delivery', deliveryAddress: { fullAddress: 123 } })).statusCode, 400);
});

test('invalid zones, closed branches and minimum order failures do not create orders', async (t) => {
  const created = fixtures(t);
  t.mock.method(DeliveryZone, 'findOne', async () => null);
  assert.equal((await submit({ deliveryType: 'delivery', deliveryAddress: { fullAddress: 'Example' }, deliveryZone: new mongoose.Types.ObjectId().toString() })).statusCode, 400);
  t.mock.method(Branch, 'findById', async () => ({ isOpen: false, minimumOrderValue: 150 }));
  assert.equal((await submit({})).statusCode, 400);
  t.mock.method(Branch, 'findById', async () => ({ isOpen: true, minimumOrderValue: 300 }));
  assert.equal((await submit({})).statusCode, 400);
  assert.equal(created.length, 0);
});

test('negative, fractional, non-finite and excessive quantities are rejected', async (t) => {
  const created = fixtures(t);
  for (const quantity of [-1, 0, 1.5, '2', Infinity, 101]) {
    assert.equal((await submit({ items: [{ item: itemId, quantity }] })).statusCode, 400);
  }
  assert.equal(created.length, 0);
});

test('orders use unique identifiers under concurrent requests and after deletion', async (t) => {
  fixtures(t);
  t.mock.method(Order, 'countDocuments', () => { throw new Error('Order numbering must not depend on counts'); });
  const results = await Promise.all(Array.from({ length: 50 }, () => submit({})));
  const numbers = results.map((res) => res.body.data.orderNumber);
  assert.equal(new Set(numbers).size, 50);
  for (const res of results) assert.equal(res.body.data.orderNumber, `F-${res.body.data._id.toHexString().toUpperCase()}`);
  assert.ok(!numbers.includes((await submit({})).body.data.orderNumber));
});

test('expired coupons are rejected and discounts never produce negative loyalty points', async (t) => {
  fixtures(t);
  t.mock.method(Coupon, 'findOne', async () => ({ status: 'expired', branches: [] }));
  assert.equal((await submit({ couponCode: 'OLD' })).statusCode, 400);
  t.mock.method(Coupon, 'findOne', async () => ({ status: 'active', code: 'BIG', discountType: 'percentage', value: 150, branches: [], usageCount: 0, save: async () => {} }));
  const res = await submit({ couponCode: 'BIG' });
  assert.equal(res.body.data.total, 0);
  assert.equal(res.body.earnedPoints, 0);
});
