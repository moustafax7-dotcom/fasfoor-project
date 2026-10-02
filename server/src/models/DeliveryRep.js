const mongoose = require('mongoose');
const deliveryRepSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    status: { type: String, enum: ['available', 'delivering', 'offline'], default: 'available' },
    avgDeliveryMinutes: { type: Number, default: 30 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('DeliveryRep', deliveryRepSchema);
