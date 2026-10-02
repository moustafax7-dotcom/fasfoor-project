const InventoryItem = require('../models/InventoryItem');
const StockMovement = require('../models/StockMovement');

exports.getInventoryItems = async (req, res, next) => {
  try {
    const { branch, status, search } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    if (search) filter.name = { $regex: search, $options: 'i' };
    let items = await InventoryItem.find(filter).populate('branch').sort({ name: 1 });
    if (status) items = items.filter((i) => i.status === status);
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
};
exports.createInventoryItem = async (req, res, next) => {
  try {
    const item = await InventoryItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};
exports.updateInventoryItem = async (req, res, next) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'الصنف غير موجود بالمخزون' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};
exports.deleteInventoryItem = async (req, res, next) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف الصنف من المخزون' });
  } catch (err) { next(err); }
};
exports.recordSupply = async (req, res, next) => {
  try {
    const { quantity, note } = req.body;
    const item = await InventoryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'الصنف غير موجود' });
    item.quantityAvailable += Number(quantity);
    item.lastSupplyDate = new Date();
    await item.save();
    await StockMovement.create({
      inventoryItem: item._id, branch: item.branch, type: 'supply',
      quantityChange: Number(quantity), resultingQuantity: item.quantityAvailable,
      note, recordedBy: req.admin._id,
    });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};
exports.recordStockCount = async (req, res, next) => {
  try {
    const { actualQuantity, note } = req.body;
    const item = await InventoryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'الصنف غير موجود' });
    const change = Number(actualQuantity) - item.quantityAvailable;
    item.quantityAvailable = Number(actualQuantity);
    await item.save();
    await StockMovement.create({
      inventoryItem: item._id, branch: item.branch, type: 'count_adjustment',
      quantityChange: change, resultingQuantity: item.quantityAvailable,
      note, recordedBy: req.admin._id,
    });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};
exports.getMovements = async (req, res, next) => {
  try {
    const { branch, inventoryItem } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    if (inventoryItem) filter.inventoryItem = inventoryItem;
    const movements = await StockMovement.find(filter).populate('inventoryItem branch recordedBy').sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: movements });
  } catch (err) { next(err); }
};
