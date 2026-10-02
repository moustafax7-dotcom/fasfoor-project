const Customer = require('../models/Customer');
const Order = require('../models/Order');
const LoyaltyConfig = require('../models/LoyaltyConfig');

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().select('-password');
    const withStats = await Promise.all(
      customers.map(async (c) => {
        const orders = await Order.find({ customer: c._id }).sort({ createdAt: -1 });
        return { ...c.toObject(), totalOrders: orders.length, lastOrderAt: orders[0]?.createdAt || null };
      })
    );
    res.json({ success: true, data: withStats });
  } catch (err) { next(err); }
};

exports.getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

// @route GET /api/customers/auth/me
exports.getMyProfile = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.customer._id }).populate('branch').sort({ createdAt: -1 });
    const loyaltyConfig = await LoyaltyConfig.findOne();
    let currentTier = null;
    if (loyaltyConfig?.tiers?.length) {
      const sortedTiers = [...loyaltyConfig.tiers].sort((a, b) => b.minPoints - a.minPoints);
      currentTier = sortedTiers.find((t) => req.customer.loyaltyPoints >= t.minPoints) || sortedTiers[sortedTiers.length - 1];
    }
    res.json({ success: true, data: { customer: req.customer, orders, loyaltyConfig, currentTier } });
  } catch (err) { next(err); }
};
