const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Customer = require('../models/Customer');
const LoyaltyConfig = require('../models/LoyaltyConfig');
const Item = require('../models/Item');
const DeliveryZone = require('../models/DeliveryZone');
const { notifyOrderStatus } = require('../services/notificationService');

const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  return `${10000 + count + 1}`;
};

exports.getOrders = async (req, res, next) => {
  try {
    const { branch, status, from, to, limit } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    let query = Order.find(filter).populate('branch customer').sort({ createdAt: -1 });
    if (limit) query = query.limit(Number(limit));
    const orders = await query;
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('branch customer items.item');
    if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    if (order.customer._id.toString() !== req.customer._id.toString()) {
      return res.status(403).json({ success: false, message: 'هذا الطلب ليس ملكك' });
    }
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};

const DEFAULT_DELIVERY_FEE = 15;

// إنشاء الطلب - محمي بتوكن العميل. كل سعر (صنف، إضافة، توصيل، خصم) بيتحسب من قاعدة
// البيانات هنا، مش من أي رقم جاي من الفرونت، عشان محدش يقدر يعدّل السعر من الـ request.
exports.createOrder = async (req, res, next) => {
  try {
    const { branch, items: requestedItems = [], deliveryZone: deliveryZoneId, couponCode } = req.body;

    if (!branch || !requestedItems.length) {
      return res.status(400).json({ success: false, message: 'الطلب لازم يحتوي على فرع وصنف واحد على الأقل' });
    }

    const orderItems = [];
    for (const requested of requestedItems) {
      const item = await Item.findById(requested.item);
      if (!item || !item.isAvailable || !item.branches.some((b) => b.toString() === branch)) {
        return res.status(400).json({ success: false, message: `الصنف "${item?.name || requested.item}" غير متاح حاليًا` });
      }

      let unitPrice = item.price;
      if (item.weightPrices?.length) {
        const match = item.weightPrices.find((w) => w.unit === requested.unit);
        if (!match) return res.status(400).json({ success: false, message: `وحدة غير صالحة للصنف "${item.name}"` });
        unitPrice = match.price;
      }

      const requestedAddOnNames = requested.addOns || [];
      const matchedAddOns = (item.addOns || []).filter((a) => requestedAddOnNames.includes(a.name));
      const addOnsTotal = matchedAddOns.reduce((sum, a) => sum + a.price, 0);

      const quantity = Math.max(1, Number(requested.quantity) || 1);
      orderItems.push({
        item: item._id,
        name: item.name,
        unit: requested.unit || 'piece',
        unitPrice: unitPrice + addOnsTotal,
        quantity,
        addOns: matchedAddOns,
        subtotal: (unitPrice + addOnsTotal) * quantity,
      });
    }

    const subtotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0);

    let deliveryFee = DEFAULT_DELIVERY_FEE;
    if (deliveryZoneId) {
      const zone = await DeliveryZone.findOne({ _id: deliveryZoneId, branch, isActive: true });
      if (zone) deliveryFee = zone.deliveryFee;
    }

    let discountAmount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon && coupon.status === 'active' && (!coupon.branches.length || coupon.branches.some((b) => b.toString() === branch))) {
        discountAmount = coupon.discountType === 'percentage'
          ? Math.round((subtotal * coupon.value) / 100)
          : Math.min(coupon.value, subtotal);
        appliedCoupon = coupon;
      }
    }

    const total = Math.max(0, subtotal - discountAmount) + deliveryFee;
    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      branch,
      customer: req.customer._id,
      items: orderItems,
      deliveryType: req.body.deliveryType || 'delivery',
      deliveryAddress: req.body.deliveryAddress,
      notes: req.body.notes,
      paymentMethod: 'cash',
      orderNumber,
      subtotal,
      deliveryFee,
      couponCode: appliedCoupon?.code,
      discountAmount,
      total,
      statusHistory: [{ status: 'new', at: new Date() }],
    });

    if (appliedCoupon) {
      appliedCoupon.usageCount += 1;
      await appliedCoupon.save();
    }

    const loyaltyConfig = await LoyaltyConfig.findOne();
    const pointsPerEGP = loyaltyConfig?.pointsPerEGP || 1;
    const earnedPoints = Math.floor((subtotal - discountAmount) * pointsPerEGP);
    if (earnedPoints > 0) {
      await Customer.findByIdAndUpdate(req.customer._id, { $inc: { loyaltyPoints: earnedPoints } });
    }

    await notifyOrderStatus(order, req.customer.phone);

    res.status(201).json({ success: true, data: order, earnedPoints });
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, cancelReason } = req.body;
    const order = await Order.findById(req.params.id).populate('customer');
    if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });

    // مدير النظام يقدر يعدّل أي طلب، أي دور تاني مقيّد بالفرع اللي متعيّن عليه
    if (req.admin.role !== 'super_admin' && req.admin.branch && req.admin.branch.toString() !== order.branch.toString()) {
      return res.status(403).json({ success: false, message: 'الطلب ده مش تابع لفرعك' });
    }

    order.status = status;
    if (status === 'cancelled') order.cancelReason = cancelReason;
    order.statusHistory.push({ status, at: new Date() });
    await order.save();

    if (order.customer?.phone) await notifyOrderStatus(order, order.customer.phone);

    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};
