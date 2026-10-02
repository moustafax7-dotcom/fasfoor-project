const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
exports.getAdminUsers = async (req, res, next) => {
  try {
    const users = await Admin.find().select('-password').populate('branch');
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};
exports.createAdminUser = async (req, res, next) => {
  try {
    const { name, username, password, role, branch } = req.body;
    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ success: false, message: 'اسم المستخدم مستخدم بالفعل' });
    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, username, password: hashed, role, branch: branch || undefined });
    const { password: _pw, ...safe } = admin.toObject();
    res.status(201).json({ success: true, data: safe });
  } catch (err) { next(err); }
};
exports.updateAdminUser = async (req, res, next) => {
  try {
    const { password, ...rest } = req.body;
    const update = { ...rest };
    if (password) update.password = await bcrypt.hash(password, 10);
    const admin = await Admin.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select('-password');
    if (!admin) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    res.json({ success: true, data: admin });
  } catch (err) { next(err); }
};
exports.deleteAdminUser = async (req, res, next) => {
  try {
    await Admin.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'تم تعطيل المستخدم' });
  } catch (err) { next(err); }
};
