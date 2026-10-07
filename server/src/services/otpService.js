const { randomInt } = require('node:crypto');

const generateOtp = () => String(randomInt(100000, 1000000));
const isOtpDeliveryAvailable = () => process.env.NODE_ENV !== 'production' && !process.env.VERCEL;

const sendOtp = async (phone, otp) => {
  if (!isOtpDeliveryAvailable()) {
    const error = new Error('خدمة إرسال كود التحقق غير مفعّلة حاليًا');
    error.status = 503;
    throw error;
  }
  // Development only. Connect a real SMS provider before enabling production sign-in.
  console.log(`[otp:development] ${phone} -> ${otp}`);
  return true;
};

module.exports = { generateOtp, sendOtp, isOtpDeliveryAvailable };
