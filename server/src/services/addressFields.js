function addressFields(body, partial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'بيانات العنوان غير صالحة' };
  const data = {};
  for (const [field, max] of [['label', 80], ['fullAddress', 500], ['city', 80]]) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== 'string' || body[field].trim().length > max || (field === 'fullAddress' && !body[field].trim())) return { error: `بيانات العنوان غير صالحة، العنوان التفصيلي في حدود 500 حرف` };
      data[field] = body[field].trim();
    }
  }
  if (!partial && !data.fullAddress) return { error: 'العنوان التفصيلي مطلوب' };
  for (const [field, max] of [['lat', 90], ['lng', 180]]) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== 'number' || !Number.isFinite(body[field]) || Math.abs(body[field]) > max) return { error: 'إحداثيات العنوان غير صالحة' };
      data[field] = body[field];
    }
  }
  if (body.isDefault !== undefined) {
    if (typeof body.isDefault !== 'boolean') return { error: 'اختيار العنوان الافتراضي غير صالح' };
    data.isDefault = body.isDefault;
  }
  return { data };
}
function ensureDefaultAddress(addresses, preferredId) {
  const preferred = addresses.find((address) => String(address._id) === String(preferredId));
  const selected = preferred || addresses.find((address) => address.isDefault) || addresses[0];
  for (const address of addresses) address.isDefault = address === selected;
}
module.exports = { addressFields, ensureDefaultAddress };
