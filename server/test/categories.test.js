const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const Category = require('../src/models/Category');
const Item = require('../src/models/Item');
const controller = require('../src/controllers/categoryController');
const id = new mongoose.Types.ObjectId().toString();
async function invoke(method, body, categoryId = id) {
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(data) { this.body = data; return this; } };
  await controller[method]({ body, params: { id: categoryId } }, res, (err) => { throw err; });
  return res;
}
test('invalid names, order values and icon types do not create categories', async (t) => {
  let writes = 0;
  t.mock.method(Category, 'create', async () => { writes++; });
  for (const body of [{ name: ' ' }, { name: 12 }, { name: 'x'.repeat(81) }, { name: 'Fish', order: -1 }, { name: 'Fish', order: 1.5 }, { name: 'Fish', order: '3' }, { name: 'Fish', icon: {} }]) assert.equal((await invoke('createCategory', body)).statusCode, 400);
  assert.equal(writes, 0);
});
test('category writes whitelist fields and trim names', async (t) => {
  t.mock.method(Category, 'create', async (data) => { assert.deepEqual(data, { name: 'Fish', order: 2, icon: '' }); return { _id: id, ...data }; });
  assert.equal((await invoke('createCategory', { name: ' Fish ', order: 2, _id: 'forged', createdAt: 'forged' })).statusCode, 201);
  t.mock.method(Category, 'findByIdAndUpdate', async (categoryId, update, options) => {
    assert.equal(categoryId, id); assert.equal(options.runValidators, true); assert.deepEqual(update, { $set: { name: 'New fish', order: 3, icon: '' } }); return { _id: id, ...update.$set };
  });
  assert.equal((await invoke('updateCategory', { name: 'New fish', order: 3, $unset: { name: 1 } })).statusCode, 200);
});
test('duplicate category names return a recoverable conflict', async (t) => {
  t.mock.method(Category, 'create', async () => { throw Object.assign(new Error('duplicate'), { code: 11000 }); });
  assert.equal((await invoke('createCategory', { name: 'Fish' })).statusCode, 409);
});
test('invalid ids and nonexistent categories return clear errors', async (t) => {
  assert.equal((await invoke('updateCategory', { name: 'Fish' }, 'invalid')).statusCode, 400);
  t.mock.method(Category, 'findByIdAndUpdate', async () => null);
  assert.equal((await invoke('updateCategory', { name: 'Fish' })).statusCode, 404);
});
test('categories assigned to menu items cannot be removed', async (t) => {
  t.mock.method(Item, 'exists', async (filter) => { assert.equal(filter.category, id); return { _id: id }; });
  t.mock.method(Category, 'findByIdAndDelete', () => { throw new Error('Must not orphan menu items'); });
  assert.equal((await invoke('deleteCategory', {})).statusCode, 409);
});
