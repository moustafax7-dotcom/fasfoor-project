const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const Customer = require('../models/Customer');

const protectCustomer = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'غير مصرح - برجاء تسجيل الدخول' });
    }
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    if (decoded.type !== 'customer') {
      return res.status(401).json({ success: false, message: 'توكن العميل مطلوب' });
    }
    const customer = await Customer.findById(decoded.id).select('-password');
    if (!customer || !customer.isActive) return res.status(401).json({ success: false, message: 'المستخدم غير موجود أو غير مفعل' });
    req.customer = customer;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'التوكن غير صالح' });
  }
};

module.exports = { protectCustomer };
