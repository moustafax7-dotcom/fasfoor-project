const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

const generateToken = (id) => jwt.sign({ id, type: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

exports.loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || !password) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني وكلمة المرور مطلوبين' });
    }
    if (!JWT_SECRET || JWT_SECRET.length < 32) {
      return res.status(503).json({ success: false, message: 'تسجيل الدخول غير متاح حاليًا' });
    }
    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin || !admin.isActive || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
    }
    admin.lastLogin = new Date();
    await admin.save();
    res.json({
      success: true,
      token: generateToken(admin._id),
      admin: { id: admin._id, name: admin.name, role: admin.role, branch: admin.branch },
    });
  } catch (err) { next(err); }
};
