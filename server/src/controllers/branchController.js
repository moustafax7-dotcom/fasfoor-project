const Branch = require('../models/Branch');

exports.getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find().populate('enabledCategories');
    res.json({ success: true, data: branches });
  } catch (err) { next(err); }
};
exports.getBranchById = async (req, res, next) => {
  try {
    const branch = await Branch.findById(req.params.id).populate('enabledCategories');
    if (!branch) return res.status(404).json({ success: false, message: 'الفرع غير موجود' });
    res.json({ success: true, data: branch });
  } catch (err) { next(err); }
};
exports.createBranch = async (req, res, next) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, data: branch });
  } catch (err) { next(err); }
};
exports.updateBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!branch) return res.status(404).json({ success: false, message: 'الفرع غير موجود' });
    res.json({ success: true, data: branch });
  } catch (err) { next(err); }
};
exports.deleteBranch = async (req, res, next) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف الفرع' });
  } catch (err) { next(err); }
};
