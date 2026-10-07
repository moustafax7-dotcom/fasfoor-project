import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApiClient } from '../src/services/api.js';
import { buildItemPayload } from '../src/services/itemPayload.js';

const storage = { getItem: (key) => ({ fasfoor_admin_token: 'admin-token', fasfoor_customer_token: 'customer-token' })[key] };
const inspect = (audience, customStorage = storage) => createApiClient(audience, {
  storage: customStorage,
  adapter: async (config) => ({ data: config.headers.Authorization, status: 200, headers: {}, config }),
});

test('shared item and order URLs use the requested authentication audience', async () => {
  for (const path of ['/items', '/orders', '/branches', '/offers']) {
    assert.equal((await inspect('admin').post(path)).data, 'Bearer admin-token');
    assert.equal((await inspect('customer').get(path)).data, 'Bearer customer-token');
  }
});

test('a missing customer token never falls back to the admin token', async () => {
  const onlyAdmin = { getItem: (key) => key === 'fasfoor_admin_token' ? 'admin-token' : null };
  assert.equal((await inspect('customer', onlyAdmin).post('/orders')).data, undefined);
});

test('multipart item payload retains arrays, booleans and the image', () => {
  const file = new Blob(['synthetic image'], { type: 'image/png' });
  const payload = buildItemPayload({ name: 'Fish', branches: ['branch-1'], price: 200, isAvailable: false, imageFile: file });
  assert.deepEqual(JSON.parse(payload.get('branches')), ['branch-1']);
  assert.equal(payload.get('isAvailable'), 'false');
  assert.equal(payload.get('price'), '200');
  assert.equal(payload.get('image').size, file.size);
  assert.equal(payload.has('imageFile'), false);
  assert.deepEqual(buildItemPayload({ name: 'Fish', imageFile: null }), { name: 'Fish' });
});
