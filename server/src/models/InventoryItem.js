const mongoose = require('mongoose');
const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    unit: { type: String, default: 'كجم' },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    quantityAvailable: { type: Number, required: true, default: 0 },
    alertThreshold: { type: Number, required: true, default: 10 },
    lastSupplyDate: { type: Date },
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
inventoryItemSchema.virtual('status').get(function () {
  return this.quantityAvailable <= this.alertThreshold ? 'low' : 'available';
});
inventoryItemSchema.set('toJSON', { virtuals: true });
inventoryItemSchema.set('toObject', { virtuals: true });
module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
