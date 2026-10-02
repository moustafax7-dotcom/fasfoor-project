const mongoose = require('mongoose');
const deliveryZoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    deliveryFee: { type: Number, required: true },
    color: { type: String, default: '#C9A24B' },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('DeliveryZone', deliveryZoneSchema);
