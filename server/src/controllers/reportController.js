const Order = require('../models/Order');
const Item = require('../models/Item');

exports.getOverview = async (req, res, next) => {
  try {
    const { branch } = req.query;
    const filter = branch ? { branch } : {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.find({ ...filter, createdAt: { $gte: today } });
    const revenueToday = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const preparingCount = await Order.countDocuments({ ...filter, status: 'preparing' });
    const unavailableItems = await Item.countDocuments({ isAvailable: false });
    res.json({ success: true, data: { ordersToday: todayOrders.length, revenueToday, preparingCount, unavailableItems } });
  } catch (err) { next(err); }
};

exports.getBranchPerformance = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: '$branch', totalSales: { $sum: '$total' }, totalOrders: { $sum: 1 } } },
    ]);
    const cancelled = await Order.aggregate([
      { $match: { status: 'cancelled' } },
      { $group: { _id: '$branch', cancelledCount: { $sum: 1 } } },
    ]);
    res.json({ success: true, data: { stats, cancelled } });
  } catch (err) { next(err); }
};
