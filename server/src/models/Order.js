const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    name: String,
    unit: String,
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    addOns: [{ name: String, price: Number }],
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  { status: String, at: { type: Date, default: Date.now } },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    assignedRep: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryRep' },

    items: [orderItemSchema],

    deliveryType: { type: String, enum: ['delivery', 'pickup'], default: 'delivery' },
    deliveryAddress: { fullAddress: String, lat: Number, lng: Number },
    notes: { type: String },

    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    couponCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },

    status: {
      type: String,
      enum: ['new', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'new',
    },
    cancelReason: { type: String },
    statusHistory: [statusHistorySchema],

    paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
