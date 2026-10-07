const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

test('concurrent requests share one connection attempt and failures permit a retry', async (t) => {
  const originalUri = process.env.MONGO_URI;
  process.env.MONGO_URI = 'mongodb://127.0.0.1/test';
  t.after(() => { if (originalUri === undefined) delete process.env.MONGO_URI; else process.env.MONGO_URI = originalUri; });
  let resolve;
  const pending = new Promise((done) => { resolve = done; });
  const mock = t.mock.method(mongoose, 'connect', () => pending);
  const attempts = Array.from({ length: 25 }, () => connectDB());
  assert.equal(mock.mock.callCount(), 1);
  resolve(mongoose);
  await Promise.all(attempts);
  mock.mock.mockImplementation(async () => { throw new Error('synthetic database failure'); });
  await assert.rejects(connectDB(), /synthetic database failure/);
  mock.mock.mockImplementation(async () => mongoose);
  assert.equal(await connectDB(), mongoose);
  assert.equal(mock.mock.callCount(), 3);
});

test('missing MONGO_URI fails before attempting a connection', async (t) => {
  const previous = process.env.MONGO_URI;
  delete process.env.MONGO_URI;
  t.after(() => { if (previous !== undefined) process.env.MONGO_URI = previous; });
  const mock = t.mock.method(mongoose, 'connect', () => { throw new Error('must not be called'); });
  await assert.rejects(connectDB(), /MONGO_URI is required/);
  assert.equal(mock.mock.callCount(), 0);
});
