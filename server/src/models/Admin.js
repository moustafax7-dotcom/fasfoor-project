const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['super_admin', 'branch_manager', 'cashier', 'kitchen', 'customer_service', 'staff'],
      default: 'staff',
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
