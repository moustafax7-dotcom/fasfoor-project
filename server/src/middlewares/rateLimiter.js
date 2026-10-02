const rateLimit = require('express-rate-limit');

// حد لمحاولات إرسال/تحقق كود OTP لكل IP - يمنع إغراق رقم معين بالطلبات أو تجربة كل الأكواد الممكنة
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: { success: false, message: 'محاولات كتير، حاول تاني بعد شوية' },
  standardHeaders: true,
  legacyHeaders: false,
});

// حد لمحاولات دخول الأدمن - يبطّئ أي محاولة تخمين باسورد
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'محاولات دخول كتير، حاول تاني بعد شوية' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { otpLimiter, adminLoginLimiter };
