const mongoose = require('mongoose');

const weightPriceSchema = new mongoose.Schema(
  {
    unit: { type: String, enum: ['quarter', 'half', 'kilo', 'piece', 'plate', 'box'], required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    branches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true }],
    image: { type: String },
    price: { type: Number },
    weightPrices: [weightPriceSchema],
    isAvailable: { type: Boolean, default: true },
    addOns: [{ name: String, price: Number }],
    priceApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    priceApprovedAt: { type: Date },
    isPriceApproved: { type: Boolean, default: false },
    isMostOrdered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
