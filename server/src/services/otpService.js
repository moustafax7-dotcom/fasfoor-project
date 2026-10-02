/**
 * إرسال كود التحقق للعميل. حاليًا Mock (بيطبع الكود في الـ console) لحد ما يترتبط
 * بمزوّد SMS/WhatsApp حقيقي (Twilio، Vonage، أو WhatsApp Cloud API مباشرة).
 * الاستبدال محصور في sendOtp بس.
 */
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const sendOtp = async (phone, otp) => {
  // TODO: استبدال باستدعاء حقيقي لمزوّد SMS/WhatsApp
  console.log(`[otp] ${phone} -> ${otp}`);
  return true;
};

module.exports = { generateOtp, sendOtp };
