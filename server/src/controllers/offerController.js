const Offer = require('../models/Offer');
exports.getOffers = async (req, res, next) => {
  try {
    const { branch, activeOnly } = req.query;
    const filter = {};
    if (branch) filter.branches = branch;
    if (activeOnly === 'true') {
      filter.isActive = true;
      filter.startDate = { $lte: new Date() };
      filter.endDate = { $gte: new Date() };
    }
    const offers = await Offer.find(filter).populate('branches');
    res.json({ success: true, data: offers });
  } catch (err) { next(err); }
};
exports.createOffer = async (req, res, next) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, data: offer });
  } catch (err) { next(err); }
};
exports.updateOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ success: false, message: 'العرض غير موجود' });
    res.json({ success: true, data: offer });
  } catch (err) { next(err); }
};
exports.deleteOffer = async (req, res, next) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف العرض' });
  } catch (err) { next(err); }
};
