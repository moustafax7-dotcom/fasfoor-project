const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    label: String,
    fullAddress: String,
    city: String,
    lat: Number,
    lng: Number,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, trim: true, lowercase: true },
    password: { type: String }, // legacy - غير مستخدم في تدفق الدخول الحالي (OTP فقط)
    isPhoneVerified: { type: Boolean, default: false },
    otpCode: { type: String, select: false },
    otpExpiresAt: { type: Date, select: false },
    otpAttempts: { type: Number, default: 0, select: false },
    addresses: [addressSchema],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    loyaltyPoints: { type: Number, default: 0 },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
