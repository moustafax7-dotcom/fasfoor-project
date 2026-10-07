const Order = require('../models/Order');
const mongoose = require('mongoose');
const Branch = require('../models/Branch');
const Coupon = require('../models/Coupon');
const Customer = require('../models/Customer');
const LoyaltyConfig = require('../models/LoyaltyConfig');
const Item = require('../models/Item');
const DeliveryZone = require('../models/DeliveryZone');
const { notifyOrderStatus } = require('../services/notificationService');

exports.getOrders = async (req, res, next) => {
  try {
    const { branch, status, from, to, limit } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    if (req.admin.role !== 'super_admin') {
      if (!req.admin.branch) return res.status(403).json({ success: false, message: 'لا يوجد فرع مرتبط بحسابك' });
      filter.branch = req.admin.branch;
    }
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
    if (order.customer?._id.toString() !== req.customer._id.toString()) {
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
    const { branch, items: requestedItems = [], deliveryZone: deliveryZoneId, couponCode, deliveryType = 'delivery' } = req.body;

    if (!mongoose.isValidObjectId(branch) || !Array.isArray(requestedItems) || !requestedItems.length || requestedItems.length > 100) {
      return res.status(400).json({ success: false, message: 'الطلب لازم يحتوي على فرع وصنف واحد على الأقل' });
    }
    if (!['delivery', 'pickup'].includes(deliveryType)) {
      return res.status(400).json({ success: false, message: 'نوع استلام الطلب غير صالح' });
    }
    const selectedBranch = await Branch.findById(branch);
    if (!selectedBranch || !selectedBranch.isOpen) {
      return res.status(400).json({ success: false, message: 'الفرع غير متاح لاستقبال الطلبات' });
    }
    if (deliveryType === 'delivery' && (typeof req.body.deliveryAddress?.fullAddress !== 'string' || !req.body.deliveryAddress.fullAddress.trim())) {
      return res.status(400).json({ success: false, message: 'عنوان التوصيل مطلوب' });
    }

    const orderItems = [];
    for (const requested of requestedItems) {
      if (!requested || !mongoose.isValidObjectId(requested.item) || !Number.isSafeInteger(requested.quantity) || requested.quantity < 1 || requested.quantity > 100) {
        return res.status(400).json({ success: false, message: 'الصنف والكمية غير صالحين' });
      }
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
      if (!Array.isArray(requestedAddOnNames) || requestedAddOnNames.some((name) => !item.addOns?.some((a) => a.name === name))) {
        return res.status(400).json({ success: false, message: 'إضافة غير متاحة لهذا الصنف' });
      }
      const matchedAddOns = (item.addOns || []).filter((a) => requestedAddOnNames.includes(a.name));
      const addOnsTotal = matchedAddOns.reduce((sum, a) => sum + a.price, 0);

      if (!Number.isFinite(unitPrice) || unitPrice < 0 || !Number.isFinite(addOnsTotal) || addOnsTotal < 0) {
        return res.status(400).json({ success: false, message: 'سعر الصنف غير متاح حاليًا' });
      }
      const quantity = requested.quantity;
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
    if (subtotal < selectedBranch.minimumOrderValue) {
      return res.status(400).json({ success: false, message: `أقل قيمة للطلب ${selectedBranch.minimumOrderValue} جنيه` });
    }

    let deliveryFee = deliveryType === 'pickup' ? 0 : DEFAULT_DELIVERY_FEE;
    if (deliveryType === 'delivery' && deliveryZoneId) {
      if (!mongoose.isValidObjectId(deliveryZoneId)) {
        return res.status(400).json({ success: false, message: 'منطقة التوصيل غير صالحة' });
      }
      const zone = await DeliveryZone.findOne({ _id: deliveryZoneId, branch, isActive: true });
      if (!zone) return res.status(400).json({ success: false, message: 'منطقة التوصيل غير متاحة لهذا الفرع' });
      deliveryFee = zone.deliveryFee;
      if (!Number.isFinite(deliveryFee) || deliveryFee < 0) {
        return res.status(400).json({ success: false, message: 'رسوم التوصيل غير متاحة' });
      }
    }

    let discountAmount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      if (typeof couponCode !== 'string') return res.status(400).json({ success: false, message: 'كود الخصم غير صالح' });
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon && coupon.status === 'active' && (!coupon.branches.length || coupon.branches.some((b) => b.toString() === branch))) {
        discountAmount = coupon.discountType === 'percentage'
          ? Math.round((subtotal * coupon.value) / 100)
          : Math.min(coupon.value, subtotal);
        if (!Number.isFinite(discountAmount) || discountAmount < 0) {
          return res.status(400).json({ success: false, message: 'قيمة الخصم غير صالحة' });
        }
        discountAmount = Math.min(discountAmount, subtotal);
        appliedCoupon = coupon;
      } else {
        return res.status(400).json({ success: false, message: 'كود الخصم غير صالح لهذا الطلب' });
      }
    }

    const total = Math.max(0, subtotal - discountAmount) + deliveryFee;
    const orderId = new mongoose.Types.ObjectId();
    const orderNumber = `F-${orderId.toHexString().toUpperCase()}`;

    const order = await Order.create({
      _id: orderId,
      branch,
      customer: req.customer._id,
      items: orderItems,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? req.body.deliveryAddress : undefined,
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
    const earnedPoints = Math.max(0, Math.floor((subtotal - discountAmount) * pointsPerEGP));
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
    if (!['new', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'حالة الطلب غير صالحة' });
    }
    const order = await Order.findById(req.params.id).populate('customer');
    if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });

    // مدير النظام يقدر يعدّل أي طلب، أي دور تاني مقيّد بالفرع اللي متعيّن عليه
    if (req.admin.role !== 'super_admin' && (!req.admin.branch || req.admin.branch.toString() !== order.branch.toString())) {
      return res.status(403).json({ success: false, message: 'الطلب ده مش تابع لفرعك' });
    }
    if (order.deliveryType === 'pickup' && status === 'out_for_delivery') {
      return res.status(400).json({ success: false, message: 'طلب الاستلام لا يتم إرساله للتوصيل' });
    }

    order.status = status;
    if (status === 'cancelled') order.cancelReason = cancelReason;
    order.statusHistory.push({ status, at: new Date() });
    await order.save();

    if (order.customer?.phone) await notifyOrderStatus(order, order.customer.phone);

    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};
