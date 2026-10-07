const Item = require('../models/Item');
const PriceChangeLog = require('../models/PriceChangeLog');
const { parseItemInput } = require('../services/itemInput');
const { saveItemImage } = require('../services/itemImage');

exports.getItems = async (req, res, next) => {
  try {
    const { branch, category, availableOnly } = req.query;
    const filter = {};
    if (branch) filter.branches = branch;
    if (category) filter.category = category;
    if (availableOnly === 'true') filter.isAvailable = true;
    const items = await Item.find(filter).populate('category branches');
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
};

exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('category branches');
    if (!item) return res.status(404).json({ success: false, message: 'الصنف غير موجود' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.createItem = async (req, res, next) => {
  try {
    const data = parseItemInput(req.body);
    if (!data.branches?.length) {
      return res.status(400).json({ success: false, message: 'يجب ربط الصنف بفرع واحد على الأقل' });
    }
    const image = await saveItemImage(req.file);
    if (image) data.image = image;
    const { priceChangeReason, ...itemData } = data;
    const item = await Item.create(itemData);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.updateItem = async (req, res, next) => {
  try {
    const existingItem = await Item.findById(req.params.id);
    if (!existingItem) return res.status(404).json({ success: false, message: 'الصنف غير موجود' });

    const data = parseItemInput(req.body);
    if (data.branches && !data.branches.length) {
      return res.status(400).json({ success: false, message: 'يجب ربط الصنف بفرع واحد على الأقل' });
    }
    const image = await saveItemImage(req.file);
    if (image) data.image = image;
    const priceChanged = data.price !== undefined && Number(data.price) !== existingItem.price;

    if (data.price !== undefined || data.weightPrices !== undefined) {
      data.isPriceApproved = false;
      data.priceApprovedBy = null;
      data.priceApprovedAt = null;
    }

    const { priceChangeReason, ...updateData } = data;
    const item = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    if (priceChanged) {
      await PriceChangeLog.create({
        item: item._id,
        itemName: item.name,
        branch: item.branches[0],
        previousPrice: existingItem.price,
        newPrice: item.price,
        reason: priceChangeReason || 'تحديث أسعار المكونات',
        changedBy: req.admin._id,
      });
    }

    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.approveItemPrice = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { isPriceApproved: true, priceApprovedBy: req.admin._id, priceApprovedAt: new Date() },
      { new: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'الصنف غير موجود' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.toggleAvailability = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'الصنف غير موجود' });
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.deleteItem = async (req, res, next) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف الصنف' });
  } catch (err) { next(err); }
};
