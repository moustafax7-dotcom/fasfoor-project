const mongoose = require('mongoose');
const priceChangeLogSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    itemName: { type: String, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    previousPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    reason: { type: String, default: 'تحديث أسعار المكونات' },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('PriceChangeLog', priceChangeLogSchema);
