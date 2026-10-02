const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    price: { type: Number, required: true },
    branches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],
    servesFrom: Number,
    servesTo: Number,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', offerSchema);
