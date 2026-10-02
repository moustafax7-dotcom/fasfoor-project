const express = require('express');
const router = express.Router();
const { protectCustomer } = require('../middlewares/customerAuth');
const { otpLimiter } = require('../middlewares/rateLimiter');
const { getMyProfile } = require('../controllers/customerController');
const {
  getFavorites, toggleFavorite, addAddress, updateAddress, deleteAddress,
  sendOtpCode, verifyOtpCode,
} = require('../controllers/customerAuthController');

// OTP هو المسار الوحيد للدخول/التسجيل - لا يوجد باسورد اختياري (ثغرة أمنية سابقة اتشالت)
router.post('/otp/send', otpLimiter, sendOtpCode);
router.post('/otp/verify', otpLimiter, verifyOtpCode);
router.get('/me', protectCustomer, getMyProfile);

router.get('/favorites', protectCustomer, getFavorites);
router.post('/favorites/:itemId', protectCustomer, toggleFavorite);

router.post('/addresses', protectCustomer, addAddress);
router.put('/addresses/:addressId', protectCustomer, updateAddress);
router.delete('/addresses/:addressId', protectCustomer, deleteAddress);

module.exports = router;
