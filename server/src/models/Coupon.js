const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true },
    branches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],
    usageLimit: { type: Number, required: true },
    usageCount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
couponSchema.virtual('status').get(function () {
  const now = new Date();
  if (!this.isActive) return 'paused';
  if (this.usageCount >= this.usageLimit) return 'expired';
  if (now < this.startDate) return 'scheduled';
  if (now > this.endDate) return 'expired';
  return 'active';
});
couponSchema.set('toJSON', { virtuals: true });
couponSchema.set('toObject', { virtuals: true });
module.exports = mongoose.model('Coupon', couponSchema);
