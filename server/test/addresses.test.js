const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const Customer = require('../src/models/Customer');
const controller = require('../src/controllers/customerAuthController');

function response() { return { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } }; }
async function run(method, customer, body = {}, addressId) {
  const res = response();
  await controller[method]({ customer: { _id: customer._id }, body, params: { addressId } }, res, (error) => { throw error; });
  return res;
}
function fixture(t) {
  const customer = new Customer({ name: 'Synthetic test customer', phone: '01000000000', addresses: [] });
  t.mock.method(Customer, 'findById', async () => customer);
  const save = t.mock.method(customer, 'save', async () => customer);
  return { customer, save };
}

test('address create trims and whitelists fields, generates its own ID and keeps one default address', async (t) => {
  const { customer } = fixture(t);
  const injectedId = new mongoose.Types.ObjectId().toString();
  assert.equal((await run('addAddress', customer, { _id: injectedId, label: ' Home ', fullAddress: ' Test street ', admin: true })).statusCode, 201);
  assert.equal(customer.addresses[0].fullAddress, 'Test street');
  assert.notEqual(customer.addresses[0]._id.toString(), injectedId);
  assert.equal(customer.addresses[0].toObject().admin, undefined);
  assert.equal(customer.addresses[0].isDefault, true);
  await run('addAddress', customer, { fullAddress: 'Office', isDefault: true });
  assert.deepEqual(customer.addresses.map((address) => address.isDefault), [false, true]);
});

test('default address can be changed; deletion promotes another address and missing IDs never save', async (t) => {
  const { customer, save } = fixture(t);
  for (const fullAddress of ['Home', 'Office']) await run('addAddress', customer, { fullAddress });
  const firstId = customer.addresses[0]._id.toString();
  const secondId = customer.addresses[1]._id.toString();
  await run('updateAddress', customer, { isDefault: true, _id: firstId }, secondId);
  assert.equal(customer.addresses[1]._id.toString(), secondId);
  assert.deepEqual(customer.addresses.map((address) => address.isDefault), [false, true]);
  await run('deleteAddress', customer, {}, secondId);
  assert.equal(customer.addresses[0].isDefault, true);
  const writes = save.mock.callCount();
  assert.equal((await run('updateAddress', customer, { label: 'Missing' }, secondId)).statusCode, 404);
  assert.equal((await run('deleteAddress', customer, {}, secondId)).statusCode, 404);
  assert.equal(save.mock.callCount(), writes);
  await run('deleteAddress', customer, {}, firstId);
  assert.equal(customer.addresses.length, 0);
});

test('malformed address fields and IDs are rejected before database access', async (t) => {
  const customer = { _id: new mongoose.Types.ObjectId() };
  t.mock.method(Customer, 'findById', () => { throw new Error('Invalid input must not query the database'); });
  for (const body of [null, [], {}, { fullAddress: ' ' }, { fullAddress: 42 }, { fullAddress: 'x'.repeat(501) }, { fullAddress: 'Test', lat: 91 }, { fullAddress: 'Test', lng: Infinity }, { fullAddress: 'Test', isDefault: 'true' }]) {
    assert.equal((await run('addAddress', customer, body)).statusCode, 400);
  }
  assert.equal((await run('updateAddress', customer, { fullAddress: '' }, new mongoose.Types.ObjectId().toString())).statusCode, 400);
  for (const method of ['updateAddress', 'deleteAddress']) assert.equal((await run(method, customer, {}, 'invalid')).statusCode, 400);
});
