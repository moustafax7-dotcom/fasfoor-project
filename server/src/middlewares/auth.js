const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'غير مصرح - برجاء تسجيل الدخول' });
    }
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'المستخدم غير موجود أو غير مفعل' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'التوكن غير صالح' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role)) {
    return res.status(403).json({ success: false, message: 'لا تملك صلاحية لهذا الإجراء' });
  }
  next();
};

module.exports = { protectAdmin, authorize };
