const LoyaltyConfig = require('../models/LoyaltyConfig');
const defaultConfig = {
  pointsPerEGP: 1, pointsValidityMonths: 12,
  rules: [
    'كل 1 جنيه يتم إنفاقه = 1 نقطة',
    'نقاط إضافية في المناسبات الخاصة',
    'تستخدم النقاط في الطلب التالي فقط',
    'صلاحية النقاط 12 شهر من تاريخ كسبها',
  ],
  tiers: [
    { name: 'المستوى البرونزي', minPoints: 0, discountPercent: 5 },
    { name: 'المستوى الفضي', minPoints: 300, discountPercent: 10 },
    { name: 'المستوى الذهبي', minPoints: 1000, discountPercent: 15 },
  ],
};
exports.getConfig = async (req, res, next) => {
  try {
    let config = await LoyaltyConfig.findOne();
    if (!config) config = await LoyaltyConfig.create(defaultConfig);
    res.json({ success: true, data: config });
  } catch (err) { next(err); }
};
exports.updateConfig = async (req, res, next) => {
  try {
    let config = await LoyaltyConfig.findOne();
    if (!config) config = new LoyaltyConfig(defaultConfig);
    Object.assign(config, req.body);
    await config.save();
    res.json({ success: true, data: config });
  } catch (err) { next(err); }
};
