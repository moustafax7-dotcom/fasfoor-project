const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { generateOtp, sendOtp } = require('../services/otpService');

const generateToken = (id) => jwt.sign({ id, type: 'customer' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
const OTP_EXPIRY_MINUTES = 5;
const REFERRAL_BONUS_POINTS = 50;

// ملحوظة أمان مهمة: النظام ده اتصمم عمدًا من غير باسورد اختياري.
// الدخول بباسورد اختياري كان بيسمح لأي حد يعرف رقم تليفون عميل إنه يدخل حسابه من غير أي تحقق فعلي.
// الدخول والتسجيل بقوا مسار واحد بس عبر OTP - آمن ومتحقق من ملكية الرقم فعليًا.

// @route POST /api/customers/auth/otp/send  { phone, name?, referralCode? }
exports.sendOtpCode = async (req, res, next) => {
  try {
    const { phone, name, referralCode } = req.body;
    if (!phone || !/^01[0-9]{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'رقم الهاتف غير صالح' });
    }

    let customer = await Customer.findOne({ phone });
    if (!customer) {
      if (!name) return res.status(400).json({ success: false, message: 'الاسم مطلوب لأول تسجيل' });

      const myReferralCode = phone.slice(-6) + Math.random().toString(36).slice(2, 4).toUpperCase();
      let referredBy = null;
      let welcomePoints = 0;

      if (referralCode) {
        const referrer = await Customer.findOne({ referralCode: referralCode.toUpperCase() });
        if (referrer) {
          referredBy = referrer._id;
          welcomePoints = REFERRAL_BONUS_POINTS;
          referrer.loyaltyPoints += REFERRAL_BONUS_POINTS;
          await referrer.save();
        }
      }

      customer = await Customer.create({
        name, phone, referralCode: myReferralCode.toUpperCase(), referredBy, loyaltyPoints: welcomePoints,
      });
    }

    const otp = generateOtp();
    customer.otpCode = otp;
    customer.otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    customer.otpAttempts = 0;
    await customer.save();

    await sendOtp(phone, otp);

    res.json({ success: true, message: `تم إرسال كود التحقق، صالح لمدة ${OTP_EXPIRY_MINUTES} دقايق` });
  } catch (err) { next(err); }
};

const MAX_OTP_ATTEMPTS = 5;

// @route POST /api/customers/auth/otp/verify  { phone, otp }
exports.verifyOtpCode = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    const customer = await Customer.findOne({ phone }).select('+otpCode +otpExpiresAt +otpAttempts');

    if (!customer || !customer.otpCode) {
      return res.status(400).json({ success: false, message: 'لم يتم إرسال كود تحقق لهذا الرقم' });
    }
    if (customer.otpExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'انتهت صلاحية الكود، اطلب كود جديد' });
    }
    if (customer.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({ success: false, message: 'محاولات كتير على الكود ده، اطلب كود جديد' });
    }
    if (customer.otpCode !== otp) {
      customer.otpAttempts += 1;
      await customer.save();
      return res.status(400).json({ success: false, message: 'الكود غير صحيح' });
    }

    customer.otpCode = undefined;
    customer.otpExpiresAt = undefined;
    customer.otpAttempts = 0;
    customer.isPhoneVerified = true;
    await customer.save();

    res.json({
      success: true,
      token: generateToken(customer._id),
      customer: {
        id: customer._id, name: customer.name, phone: customer.phone,
        email: customer.email, referralCode: customer.referralCode,
      },
    });
  } catch (err) { next(err); }
};

// ===== المفضلة =====
exports.getFavorites = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customer._id).populate({
      path: 'favorites', populate: { path: 'category branches' },
    });
    res.json({ success: true, data: customer.favorites });
  } catch (err) { next(err); }
};

exports.toggleFavorite = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customer._id);
    const { itemId } = req.params;
    const exists = customer.favorites.some((f) => f.toString() === itemId);
    if (exists) customer.favorites = customer.favorites.filter((f) => f.toString() !== itemId);
    else customer.favorites.push(itemId);
    await customer.save();
    res.json({ success: true, favorited: !exists, data: customer.favorites });
  } catch (err) { next(err); }
};

// ===== العناوين =====
exports.addAddress = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customer._id);
    const { label, fullAddress, city, lat, lng, isDefault } = req.body;
    if (isDefault) customer.addresses.forEach((a) => { a.isDefault = false; });
    customer.addresses.push({ label, fullAddress, city, lat, lng, isDefault: isDefault || customer.addresses.length === 0 });
    await customer.save();
    res.status(201).json({ success: true, data: customer.addresses });
  } catch (err) { next(err); }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customer._id);
    const address = customer.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ success: false, message: 'العنوان غير موجود' });
    if (req.body.isDefault) customer.addresses.forEach((a) => { a.isDefault = false; });
    Object.assign(address, req.body);
    await customer.save();
    res.json({ success: true, data: customer.addresses });
  } catch (err) { next(err); }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customer._id);
    customer.addresses = customer.addresses.filter((a) => a._id.toString() !== req.params.addressId);
    await customer.save();
    res.json({ success: true, data: customer.addresses });
  } catch (err) { next(err); }
};
