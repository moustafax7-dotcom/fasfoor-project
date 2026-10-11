import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSessionStore } from '../src/services/sessionStorage.js';

function storageFixture(entries = []) {
  const data = new Map(entries);
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key) };
}

test('corrupt session data is discarded without crashing or clearing the other audience', () => {
  const storage = storageFixture([['fasfoor_customer', '{broken'], ['fasfoor_customer_token', 'customer-token'], ['fasfoor_admin_token', 'admin-token']]);
  const store = createSessionStore(() => storage);
  assert.equal(store.restore('customer'), null);
  assert.equal(store.getToken('customer'), null);
  assert.equal(store.getToken('admin'), 'admin-token');
});

test('a profile without its token does not restore a logged-in session', () => {
  for (const profile of [{ _id: 'customer-1' }, [], 'invalid', { name: 'No id' }]) {
    const store = createSessionStore(() => storageFixture([['fasfoor_customer', JSON.stringify(profile)]]));
    assert.equal(store.restore('customer'), null);
  }
});

test('valid sessions survive a new store instance', () => {
  const storage = storageFixture();
  const user = { _id: 'admin-1', role: 'super_admin' };
  createSessionStore(() => storage).save('admin', 'test-token', user);
  assert.deepEqual(createSessionStore(() => storage).restore('admin'), user);
});

test('normal storage changes from another tab remain visible to requests', () => {
  const storage = storageFixture();
  const store = createSessionStore(() => storage);
  store.save('admin', 'test-token', { _id: 'admin-1' });
  storage.removeItem('fasfoor_admin_token');
  assert.equal(store.getToken('admin'), null);
});

test('blocked storage supports login and logout in memory without exposing stale tokens', () => {
  const store = createSessionStore(() => { throw new Error('Storage blocked'); });
  assert.equal(store.restore('customer'), null);
  const user = { _id: 'customer-1' };
  store.save('customer', 'test-token', user);
  assert.deepEqual(store.restore('customer'), user);
  assert.equal(store.getToken('customer'), 'test-token');
  store.clear('customer');
  assert.equal(store.restore('customer'), null);
  assert.equal(store.getToken('customer'), null);
});

test('failed removal cannot reuse a stored token after logout in the current tab', () => {
  const storage = storageFixture([['fasfoor_admin_token', 'old-token']]);
  storage.removeItem = () => { throw new Error('Removal blocked'); };
  const store = createSessionStore(() => storage);
  store.clear('admin');
  assert.equal(store.getToken('admin'), null);
});
