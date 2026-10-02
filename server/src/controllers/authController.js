const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

exports.loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني وكلمة المرور مطلوبين' });
    }
    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
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
