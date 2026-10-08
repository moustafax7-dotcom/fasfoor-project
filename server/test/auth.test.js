process.env.JWT_SECRET = 'synthetic-test-key-with-at-least-32-characters';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const Admin = require('../src/models/Admin');
const Customer = require('../src/models/Customer');
const { protectAdmin } = require('../src/middlewares/auth');
const { protectCustomer } = require('../src/middlewares/customerAuth');
const { loginAdmin } = require('../src/controllers/authController');

function response() { return { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } }; }

test('admin and customer tokens are rejected by the other audience before database access', async (t) => {
  t.mock.method(Admin, 'findById', () => { throw new Error('Must not query admin'); });
  t.mock.method(Customer, 'findById', () => { throw new Error('Must not query customer'); });
  for (const [type, middleware] of [['customer', protectAdmin], ['admin', protectCustomer]]) {
    const token = jwt.sign({ id: 'synthetic', type }, process.env.JWT_SECRET);
    const res = response();
    await middleware({ headers: { authorization: `Bearer ${token}` } }, res, () => { throw new Error('Must not authorize'); });
    assert.equal(res.statusCode, 401);
  }
});

test('inactive administrators cannot sign in', async (t) => {
  t.mock.method(Admin, 'findOne', async () => ({ isActive: false }));
  const res = response();
  await loginAdmin({ body: { username: 'inactive@example.test', password: 'synthetic' } }, res, (error) => { throw error; });
  assert.equal(res.statusCode, 401);
});

test('inactive customer accounts cannot use a valid customer token', async (t) => {
  t.mock.method(Customer, 'findById', () => ({ select: async () => ({ isActive: false }) }));
  const token = jwt.sign({ id: 'synthetic', type: 'customer' }, process.env.JWT_SECRET);
  const res = response();
  await protectCustomer({ headers: { authorization: `Bearer ${token}` } }, res, () => { throw new Error('Must not authorize'); });
  assert.equal(res.statusCode, 401);
});
