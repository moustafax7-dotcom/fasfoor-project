const fields = ['name', 'description', 'category', 'branches', 'image', 'price', 'weightPrices', 'addOns', 'isAvailable', 'isMostOrdered', 'priceChangeReason'];
const arrayFields = ['branches', 'weightPrices', 'addOns'];

function parseItemInput(body) {
  const data = {};
  for (const field of fields) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  for (const field of arrayFields) {
    if (typeof data[field] === 'string') {
      try { data[field] = JSON.parse(data[field]); }
      catch { throw Object.assign(new Error(`قيمة ${field} غير صالحة`), { status: 400 }); }
    }
    if (data[field] !== undefined && !Array.isArray(data[field])) {
      throw Object.assign(new Error(`قيمة ${field} يجب أن تكون قائمة`), { status: 400 });
    }
  }
  for (const field of ['isAvailable', 'isMostOrdered']) {
    if (data[field] === 'true') data[field] = true;
    if (data[field] === 'false') data[field] = false;
  }
  if (data.price !== undefined) {
    if (data.price === '' || !Number.isFinite(Number(data.price)) || Number(data.price) < 0) {
      throw Object.assign(new Error('السعر غير صالح'), { status: 400 });
    }
    data.price = Number(data.price);
  }
  if (data.image && !/^https:\/\//.test(data.image) && !/^\/uploads\/[a-zA-Z0-9.-]+$/.test(data.image)) {
    throw Object.assign(new Error('رابط الصورة غير صالح'), { status: 400 });
  }
  return data;
}

module.exports = { parseItemInput };
