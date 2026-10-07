const mongoose = require('mongoose');
const Category = require('../models/Category');
const Item = require('../models/Item');

function categoryFields(body) {
  if (!body || typeof body.name !== 'string' || !body.name.trim() || body.name.trim().length > 80) {
    return { error: 'اسم القسم مطلوب وفي حدود 80 حرفًا' };
  }
  const order = body.order ?? 0;
  if (!Number.isSafeInteger(order) || order < 0 || order > 9999) return { error: 'ترتيب القسم لازم يكون رقمًا صحيحًا من 0 إلى 9999' };
  if (body.icon != null && (typeof body.icon !== 'string' || body.icon.length > 40)) return { error: 'رمز القسم غير صالح' };
  return { data: { name: body.name.trim(), order, icon: body.icon?.trim() || '' } };
}
function handleError(err, res, next) {
  if (err.code === 11000) return res.status(409).json({ success: false, message: 'فيه قسم بنفس الاسم بالفعل' });
  next(err);
}
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
};
exports.createCategory = async (req, res, next) => {
  const fields = categoryFields(req.body);
  if (fields.error) return res.status(400).json({ success: false, message: fields.error });
  try {
    const category = await Category.create(fields.data);
    res.status(201).json({ success: true, data: category });
  } catch (err) { handleError(err, res, next); }
};
exports.updateCategory = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'القسم غير صالح' });
  const fields = categoryFields(req.body);
  if (fields.error) return res.status(400).json({ success: false, message: fields.error });
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { $set: fields.data }, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'القسم غير موجود' });
    res.json({ success: true, data: category });
  } catch (err) { handleError(err, res, next); }
};
exports.deleteCategory = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'القسم غير صالح' });
  try {
    if (await Item.exists({ category: req.params.id })) return res.status(409).json({ success: false, message: 'لا يمكن حذف قسم مرتبط بأصناف' });
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'القسم غير موجود' });
    res.json({ success: true, message: 'تم حذف القسم' });
  } catch (err) { next(err); }
};
