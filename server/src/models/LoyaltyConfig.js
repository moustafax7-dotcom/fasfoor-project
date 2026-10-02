const mongoose = require('mongoose');
const tierSchema = new mongoose.Schema(
  { name: { type: String, required: true }, minPoints: { type: Number, required: true }, discountPercent: { type: Number, required: true } },
  { _id: false }
);
const loyaltyConfigSchema = new mongoose.Schema(
  {
    pointsPerEGP: { type: Number, default: 1 },
    pointsValidityMonths: { type: Number, default: 12 },
    rules: [{ type: String }],
    tiers: [tierSchema],
  },
  { timestamps: true }
);
module.exports = mongoose.model('LoyaltyConfig', loyaltyConfigSchema);
