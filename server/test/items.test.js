const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const fs = require('node:fs/promises');
const path = require('node:path');
const upload = require('../src/middlewares/upload');
const Item = require('../src/models/Item');
const { createItem, updateItem } = require('../src/controllers/itemController');
const { errorHandler } = require('../src/middlewares/errorHandler');
const { saveItemImage } = require('../src/services/itemImage');
const { parseItemInput } = require('../src/services/itemInput');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6bV8AAAAASUVORK5CYII=', 'base64');

async function itemServer(t) {
  const app = express();
  app.use(express.json());
  app.post('/items', upload.single('image'), createItem);
  app.put('/items/:id', (req, res, next) => { req.admin = { _id: 'synthetic' }; next(); }, upload.single('image'), updateItem);
  app.use(errorHandler);
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.on('listening', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}

function payload() {
  const body = new FormData();
  body.append('name', 'Fish'); body.append('branches', '["branch-1"]'); body.append('category', 'category-1');
  body.append('price', '200'); body.append('isAvailable', 'false');
  body.append('image', new Blob([png], { type: 'image/png' }), 'fish.png');
  return body;
}

test('multipart image upload persists the image reference on create and update', async (t) => {
  process.env.NODE_ENV = 'development';
  let saved;
  t.mock.method(Item, 'create', async (data) => { saved = data; return data; });
  t.mock.method(Item, 'findById', async () => ({ price: 200 }));
  t.mock.method(Item, 'findByIdAndUpdate', async (id, data) => { saved = data; return data; });
  const base = await itemServer(t);
  for (const [method, route] of [['POST', '/items'], ['PUT', '/items/example']]) {
    const res = await fetch(base + route, { method, body: payload() });
    assert.equal(res.status, method === 'POST' ? 201 : 200);
    assert.equal(saved.isAvailable, false);
    assert.deepEqual(saved.branches, ['branch-1']);
    assert.match(saved.image, /^\/uploads\/[\w-]+\.png$/);
    const imagePath = path.join(__dirname, '..', saved.image);
    assert.deepEqual(await fs.readFile(imagePath), png);
    await fs.unlink(imagePath);
  }
});

test('malformed arrays and disallowed approval fields cannot enter item updates', () => {
  assert.throws(() => parseItemInput({ branches: 'bad JSON' }), /غير صالحة/);
  assert.throws(() => parseItemInput({ branches: '"single"' }), /قائمة/);
  assert.throws(() => parseItemInput({ price: -1 }), /السعر/);
  assert.equal(parseItemInput({ isPriceApproved: true, priceApprovedBy: 'someone' }).isPriceApproved, undefined);
});

test('forged image MIME types and oversized multipart files are rejected', async (t) => {
  await assert.rejects(saveItemImage({ mimetype: 'image/png', buffer: Buffer.from('<script>') }), /ليس صورة/);
  const base = await itemServer(t);
  const body = new FormData();
  body.append('image', new Blob([Buffer.alloc(4 * 1024 * 1024 + 1)], { type: 'image/png' }), 'large.png');
  assert.equal((await fetch(base + '/items', { method: 'POST', body })).status, 413);
});

test('production uploads require persistent storage and signed uploads save the returned HTTPS URL', async (t) => {
  process.env.NODE_ENV = 'production';
  t.after(() => { process.env.NODE_ENV = 'development'; for (const key of ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']) delete process.env[key]; });
  await assert.rejects(saveItemImage({ mimetype: 'image/png', buffer: png }), /التخزين السحابي/);
  process.env.CLOUDINARY_CLOUD_NAME = 'synthetic'; process.env.CLOUDINARY_API_KEY = 'synthetic'; process.env.CLOUDINARY_API_SECRET = 'synthetic';
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.cloudinary.com/v1_1/synthetic/image/upload');
    assert.match(options.body.get('signature'), /^[a-f0-9]{40}$/);
    assert.equal(options.body.has('api_secret'), false);
    return { ok: true, json: async () => ({ secure_url: 'https://images.example.test/fish.png' }) };
  });
  assert.equal(await saveItemImage({ mimetype: 'image/png', buffer: png, originalname: 'fish.png' }), 'https://images.example.test/fish.png');
});
