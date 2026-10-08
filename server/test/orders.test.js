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

test('line notes and order notes survive checkout while delivery addresses only preserve their permitted fields', async (t) => {
  const created = fixtures(t);
  const result = await submit({ items: [{ item: itemId, quantity: 1, notes: ' No salt ' }], notes: ' Call first ', deliveryType: 'delivery', deliveryAddress: { fullAddress: ' Test street ', unknown: 'ignored' } });
  assert.equal(result.statusCode, 201);
  assert.equal(created[0].items[0].notes, 'No salt');
  assert.equal(created[0].notes, 'Call first');
  assert.deepEqual(created[0].deliveryAddress, { fullAddress: 'Test street' });
  const document = new Order(created[0]);
  assert.equal(document.items[0].notes, 'No salt');
});

test('malformed or excessive order notes, line notes and delivery addresses never create an order', async (t) => {
  const created = fixtures(t);
  for (const notes of [{ unsafe: true }, 'x'.repeat(251)]) {
    assert.equal((await submit({ notes })).statusCode, 400);
    assert.equal((await submit({ items: [{ item: itemId, quantity: 1, notes }] })).statusCode, 400);
  }
  for (const fullAddress of [' ', 'x'.repeat(501)]) assert.equal((await submit({ deliveryType: 'delivery', deliveryAddress: { fullAddress } })).statusCode, 400);
  assert.equal(created.length, 0);
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

function statusResponse() {
  return { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}
function statusFixture(t, overrides = {}) {
  const snapshot = { _id: new mongoose.Types.ObjectId(), status: 'new', deliveryType: 'delivery', branch: branchId, customer: { phone: 'test' }, ...overrides };
  t.mock.method(Order, 'findById', () => ({ populate: async () => ({ ...snapshot }) }));
  const writes = [];
  t.mock.method(Order, 'findOneAndUpdate', (filter, update) => ({ populate: async () => {
    if (filter.status !== snapshot.status) return null;
    writes.push(update); Object.assign(snapshot, update.$set); return { ...snapshot };
  } }));
  return { snapshot, writes, run: async (status, cancelReason, admin = { role: 'super_admin' }) => {
    const res = statusResponse();
    await controller.updateOrderStatus({ params: { id: snapshot._id }, body: { status, cancelReason }, admin }, res, (err) => { throw err; });
    return res;
  } };
}
test('delivery advances in order, rejects skipped/reversed states and keeps completion terminal', async (t) => {
  const flow = statusFixture(t);
  assert.equal((await flow.run('delivered')).statusCode, 409);
  for (const status of ['preparing', 'ready', 'out_for_delivery', 'delivered']) assert.equal((await flow.run(status)).statusCode, 200);
  assert.equal((await flow.run('preparing')).statusCode, 409);
  assert.equal((await flow.run('cancelled', 'too late')).statusCode, 409);
  assert.equal((await flow.run('delivered')).statusCode, 200);
  assert.equal(flow.writes.length, 4);
  assert.equal(flow.writes[3].$push.statusHistory.status, 'delivered');
});
test('pickup completes at the branch, cancellation requires a reason and stays terminal', async (t) => {
  const flow = statusFixture(t, { status: 'ready', deliveryType: 'pickup' });
  assert.equal((await flow.run('out_for_delivery')).statusCode, 400);
  assert.equal((await flow.run('cancelled', ' ')).statusCode, 400);
  assert.equal((await flow.run('cancelled', 'x'.repeat(251))).statusCode, 400);
  assert.equal((await flow.run('delivered')).statusCode, 200);
  const cancelled = statusFixture(t, { status: 'preparing' });
  assert.equal((await cancelled.run('cancelled', '  customer requested  ')).statusCode, 200);
  assert.equal(cancelled.snapshot.cancelReason, 'customer requested');
  assert.equal((await cancelled.run('ready')).statusCode, 409);
});
test('concurrent operators cannot append the same status transition twice', async (t) => {
  const flow = statusFixture(t);
  const results = await Promise.all([flow.run('preparing'), flow.run('preparing')]);
  assert.deepEqual(results.map((res) => res.statusCode).sort(), [200, 409]);
  assert.equal(flow.writes.length, 1);
});
test('another branch cannot change status, and missing orders return 404', async (t) => {
  const flow = statusFixture(t);
  assert.equal((await flow.run('preparing', undefined, { role: 'branch_manager', branch: new mongoose.Types.ObjectId() })).statusCode, 403);
  assert.equal(flow.writes.length, 0);
  t.mock.method(Order, 'findById', () => ({ populate: async () => null }));
  assert.equal((await flow.run('preparing')).statusCode, 404);
});
