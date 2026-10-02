const Coupon = require('../models/Coupon');
exports.getCoupons = async (req, res, next) => {
  try {
    const { branch, search } = req.query;
    const filter = {};
    if (branch) filter.branches = branch;
    if (search) filter.code = { $regex: search, $options: 'i' };
    const coupons = await Coupon.find(filter).populate('branches').sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (err) { next(err); }
};
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (err) { next(err); }
};
exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'الكوبون غير موجود' });
    res.json({ success: true, data: coupon });
  } catch (err) { next(err); }
};
exports.deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف الكوبون' });
  } catch (err) { next(err); }
};
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, branch } = req.query;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase() });
    if (!coupon) return res.status(404).json({ success: false, message: 'كود الخصم غير موجود' });
    if (coupon.status !== 'active') return res.status(400).json({ success: false, message: 'كود الخصم غير صالح حاليًا' });
    if (coupon.branches.length && branch && !coupon.branches.some((b) => b.toString() === branch)) {
      return res.status(400).json({ success: false, message: 'الكود غير متاح في هذا الفرع' });
    }
    res.json({ success: true, data: coupon });
  } catch (err) { next(err); }
};
