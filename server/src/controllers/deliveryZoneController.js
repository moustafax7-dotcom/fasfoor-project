const DeliveryZone = require('../models/DeliveryZone');
exports.getZones = async (req, res, next) => {
  try {
    const { branch } = req.query;
    const filter = branch ? { branch } : {};
    const zones = await DeliveryZone.find(filter).populate('branch').sort({ createdAt: 1 });
    res.json({ success: true, data: zones });
  } catch (err) { next(err); }
};
exports.createZone = async (req, res, next) => {
  try {
    const zone = await DeliveryZone.create(req.body);
    res.status(201).json({ success: true, data: zone });
  } catch (err) { next(err); }
};
exports.updateZone = async (req, res, next) => {
  try {
    const zone = await DeliveryZone.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!zone) return res.status(404).json({ success: false, message: 'المنطقة غير موجودة' });
    res.json({ success: true, data: zone });
  } catch (err) { next(err); }
};
exports.deleteZone = async (req, res, next) => {
  try {
    await DeliveryZone.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف المنطقة' });
  } catch (err) { next(err); }
};
