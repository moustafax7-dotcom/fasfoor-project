const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
};
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) { next(err); }
};
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
};
exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف القسم' });
  } catch (err) { next(err); }
};
