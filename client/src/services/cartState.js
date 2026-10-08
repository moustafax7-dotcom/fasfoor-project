export const CART_STORAGE_KEY = 'fasfoor_cart_v1';
export const emptyCart = () => ({ items: [], branchId: null });
const validId = (value) => typeof value === 'string' && /^[a-f0-9]{24}$/i.test(value);
const units = new Set(['quarter', 'half', 'kilo', 'piece', 'plate', 'box']);

export const cartKey = (item) => JSON.stringify([item.itemId, item.unit, [...(item.addOns || [])].sort(), item.notes?.trim() || '']);
export const itemBranch = (item, preferred) => item.branches?.find((branch) => (branch._id || branch) === preferred) || item.branches?.[0];

export function validateCartLine(item, branchId) {
  if (!item || !validId(item.itemId) || !validId(branchId) || item.branchId !== branchId || !units.has(item.unit)) throw new Error('بيانات الصنف أو الفرع غير صالحة');
  if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) throw new Error('كمية الصنف لازم تكون من 1 إلى 100');
  if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) throw new Error('سعر الصنف غير متاح');
  if (typeof item.name !== 'string' || !item.name.trim() || !Array.isArray(item.addOns || []) || (item.addOns || []).some((name) => typeof name !== 'string')) throw new Error('بيانات الصنف غير صالحة');
  if (item.notes != null && (typeof item.notes !== 'string' || item.notes.length > 250)) throw new Error('ملاحظات الصنف في حدود 250 حرفًا');
  return {
    itemId: item.itemId, branchId, name: item.name.trim(), unit: item.unit, unitPrice: item.unitPrice,
    quantity: item.quantity, addOns: [...new Set(item.addOns || [])], notes: item.notes?.trim() || '',
    image: typeof item.image === 'string' && (item.image.startsWith('https://') || item.image.startsWith('/images/')) ? item.image : '',
  };
}
export function validateCart(cart) {
  if (!cart || !Array.isArray(cart.items) || cart.items.length > 100 || (cart.branchId !== null && !validId(cart.branchId))) throw new Error('بيانات السلة غير صالحة');
  return { branchId: cart.branchId, items: cart.items.map((item) => validateCartLine(item, cart.branchId)) };
}
export function readCart(storage) {
  try {
    const saved = JSON.parse(storage?.getItem(CART_STORAGE_KEY) || 'null');
    return saved?.version === 1 ? validateCart(saved.cart) : emptyCart();
  } catch { return emptyCart(); }
}
export function writeCart(storage, cart) {
  try { storage?.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, cart: validateCart(cart) })); return true; }
  catch { return false; }
}
export function appendCartLine(items, item) {
  const line = validateCartLine(item, item.branchId);
  const existing = items.find((entry) => cartKey(entry) === cartKey(line));
  if (existing && existing.quantity + line.quantity > 100) throw new Error('أقصى كمية لنفس اختيار الصنف هي 100');
  if (!existing && items.length >= 100) throw new Error('أقصى عدد اختيارات في الطلب هو 100');
  return existing ? items.map((entry) => cartKey(entry) === cartKey(line) ? { ...line, quantity: entry.quantity + line.quantity } : entry) : [...items, line];
}

// The order API populates each historical line with the current item document.
// Reordering must use current prices and skip choices that the restaurant no longer offers.
export function prepareReorder(order) {
  const branchId = order.branch?._id || order.branch;
  if (!validId(branchId)) throw new Error('فرع الطلب لم يعد متاحًا');
  let items = [];
  const unavailable = [];
  let pricesChanged = false;
  for (const previous of order.items || []) {
    const item = previous.item;
    const sameBranch = item?.branches?.some((branch) => (branch._id || branch) === branchId);
    const unitPrice = item?.weightPrices?.length ? item.weightPrices.find((price) => price.unit === previous.unit)?.price : item?.price;
    const names = [...new Set((previous.addOns || []).map((addon) => addon.name))];
    const addOns = names.map((name) => item?.addOns?.find((addon) => addon.name === name));
    if (!item?.isAvailable || !sameBranch || !Number.isFinite(unitPrice) || unitPrice < 0 || addOns.some((addon) => !addon || !Number.isFinite(addon.price) || addon.price < 0)) {
      unavailable.push(previous.name); continue;
    }
    const currentPrice = unitPrice + addOns.reduce((sum, addon) => sum + addon.price, 0);
    pricesChanged ||= currentPrice !== previous.unitPrice;
    items = appendCartLine(items, { itemId: item._id, name: item.name, unit: previous.unit, unitPrice: currentPrice, quantity: previous.quantity, addOns: names, branchId, image: item.image, notes: previous.notes || '' });
  }
  if (!items.length) throw new Error('أصناف الطلب السابق غير متاحة حاليًا. اختار من المنيو.');
  return { cart: { branchId, items }, unavailable, pricesChanged };
}

export function refreshCartPricing(cart, currentItems) {
  const catalog = new Map(currentItems.map((item) => [item._id, item]));
  return prepareReorder({ branch: cart.branchId, items: cart.items.map((line) => ({
    ...line, item: catalog.get(line.itemId), addOns: line.addOns.map((name) => ({ name })),
  })) });
}
