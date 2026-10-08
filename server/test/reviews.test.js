const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const Order = require('../src/models/Order');
const Review = require('../src/models/Review');
const { createReview } = require('../src/controllers/reviewController');
const customerId = new mongoose.Types.ObjectId();
const orderId = new mongoose.Types.ObjectId().toString();
const branchId = new mongoose.Types.ObjectId();
async function submit(body = {}) {
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; } };
  await createReview({ body: { orderId, rating: 5, ...body }, customer: { _id: customerId } }, res, (error) => { throw error; });
  return res;
}
test('invalid rating, comment or order ID cannot reach review persistence', async (t) => {
  t.mock.method(Order, 'findById', () => { throw new Error('Invalid input must not query orders'); });
  for (const body of [{ rating: 0 }, { rating: 6 }, { rating: 2.5 }, { rating: '5' }, { comment: {} }, { comment: 'x'.repeat(501) }, { orderId: 'invalid' }]) assert.equal((await submit(body)).statusCode, 400);
});
test('only the owner can review a delivered order, and an existing review is rejected', async (t) => {
  const order = { customer: customerId, branch: branchId, status: 'new' };
  t.mock.method(Order, 'findById', async () => order);
  t.mock.method(Review, 'findOne', async () => null);
  const saved = t.mock.method(Review, 'create', async (data) => data);
  assert.equal((await submit()).statusCode, 400);
  order.status = 'delivered'; order.customer = new mongoose.Types.ObjectId();
  assert.equal((await submit()).statusCode, 403);
  order.customer = customerId;
  const result = await submit({ comment: ' Great food ' });
  assert.equal(result.statusCode, 201);
  assert.equal(result.body.data.comment, 'Great food');
  t.mock.method(Review, 'findOne', async () => ({ _id: 'existing' }));
  assert.equal((await submit()).statusCode, 400);
  assert.equal(saved.mock.callCount(), 1);
});
