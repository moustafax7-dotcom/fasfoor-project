const DeliveryRep = require('../models/DeliveryRep');
const Order = require('../models/Order');
exports.getReps = async (req, res, next) => {
  try {
    const { branch } = req.query;
    const filter = branch ? { branch } : {};
    const reps = await DeliveryRep.find(filter).populate('branch').sort({ createdAt: 1 });
    const withStats = await Promise.all(
      reps.map(async (rep) => {
        const activeOrders = await Order.countDocuments({ assignedRep: rep._id, status: 'out_for_delivery' });
        return { ...rep.toObject(), activeOrders };
      })
    );
    res.json({ success: true, data: withStats });
  } catch (err) { next(err); }
};
exports.createRep = async (req, res, next) => {
  try {
    const rep = await DeliveryRep.create(req.body);
    res.status(201).json({ success: true, data: rep });
  } catch (err) { next(err); }
};
exports.updateRep = async (req, res, next) => {
  try {
    const rep = await DeliveryRep.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!rep) return res.status(404).json({ success: false, message: 'المندوب غير موجود' });
    res.json({ success: true, data: rep });
  } catch (err) { next(err); }
};
exports.deleteRep = async (req, res, next) => {
  try {
    await DeliveryRep.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف المندوب' });
  } catch (err) { next(err); }
};
