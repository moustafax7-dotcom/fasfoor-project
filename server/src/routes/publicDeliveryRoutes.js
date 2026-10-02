const express = require('express');
const router = express.Router();
const DeliveryZone = require('../models/DeliveryZone');
// مسار عام (بدون توكن أدمن) - العميل محتاجه في السلة عشان يختار منطقته ويشوف رسوم التوصيل الحقيقية
router.get('/', async (req, res, next) => {
  try {
    const { branch } = req.query;
    const filter = { isActive: true };
    if (branch) filter.branch = branch;
    const zones = await DeliveryZone.find(filter).sort({ deliveryFee: 1 });
    res.json({ success: true, data: zones });
  } catch (err) { next(err); }
});
module.exports = router;
