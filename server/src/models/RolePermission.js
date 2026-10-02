const mongoose = require('mongoose');
const rolePermissionSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    permissions: {
      orders: { type: Boolean, default: false },
      items: { type: Boolean, default: false },
      reports: { type: Boolean, default: false },
      branches: { type: Boolean, default: false },
      customers: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('RolePermission', rolePermissionSchema);
