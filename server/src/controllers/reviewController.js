const Review = require('../models/Review');
const Order = require('../models/Order');
exports.createReview = async (req, res, next) => {
  try {
    const { orderId, rating, comment } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    if (order.customer.toString() !== req.customer._id.toString()) {
      return res.status(403).json({ success: false, message: 'هذا الطلب ليس ملكك' });
    }
    if (order.status !== 'delivered') {
      return res.status(400).json({ success: false, message: 'التقييم متاح فقط بعد تسليم الطلب' });
    }
    const existing = await Review.findOne({ order: orderId });
    if (existing) return res.status(400).json({ success: false, message: 'تم تقييم هذا الطلب من قبل' });
    const review = await Review.create({ order: orderId, customer: req.customer._id, branch: order.branch, rating, comment });
    res.status(201).json({ success: true, data: review });
  } catch (err) { next(err); }
};
exports.getReviews = async (req, res, next) => {
  try {
    const { branch } = req.query;
    const filter = branch ? { branch } : {};
    const reviews = await Review.find(filter).populate('customer branch order').sort({ createdAt: -1 });
    const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;
    res.json({ success: true, data: reviews, avgRating, totalReviews: reviews.length });
  } catch (err) { next(err); }
};
