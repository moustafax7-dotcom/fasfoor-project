const PriceChangeLog = require('../models/PriceChangeLog');
exports.getPriceChangeLogs = async (req, res, next) => {
  try {
    const { branch, search, from, to } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    if (search) filter.$or = [{ itemName: { $regex: search, $options: 'i' } }, { reason: { $regex: search, $options: 'i' } }];
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    const logs = await PriceChangeLog.find(filter).populate('branch changedBy').sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, data: logs });
  } catch (err) { next(err); }
};
