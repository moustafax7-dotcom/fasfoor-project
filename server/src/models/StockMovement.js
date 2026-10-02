const mongoose = require('mongoose');
const stockMovementSchema = new mongoose.Schema(
  {
    inventoryItem: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    type: { type: String, enum: ['supply', 'count_adjustment'], required: true },
    quantityChange: { type: Number, required: true },
    resultingQuantity: { type: Number, required: true },
    note: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);
module.exports = mongoose.model('StockMovement', stockMovementSchema);
