const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    workingHours: {
      from: { type: String, default: '12:00 م' },
      to: { type: String, default: '1:00 ص' },
    },
    location: { lat: Number, lng: Number },
    enabledCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    estimatedDeliveryMinutes: { type: Number, default: 30 },
    minimumOrderValue: { type: Number, default: 150 },
    isOpen: { type: Boolean, default: true },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Branch', branchSchema);
