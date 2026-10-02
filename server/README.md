# Fasfoor Server (Backend)

Node.js + Express + MongoDB API لمطعم فسفور.

## التشغيل
```bash
cp .env.example .env   # عدّل القيم حسب بيئتك
npm install
npm run seed            # يعبّي بيانات حقيقية: فروع، منيو، أدمن تجريبي...
npm run dev
```

## بيانات الدخول بعد npm run seed
- أدمن: `admin@fosfor.com` / باسورد عشوائي بيتطبع مرة واحدة في الـ console وقت تشغيل `npm run seed`
- عميل تجريبي: `01012345678` (دخول عبر OTP، الكود هيظهر في الـ console)
- كوبون: `FOS20`

## هيكل المشروع
```
server/
├── src/
│   ├── config/       # اتصال DB والإعدادات
│   ├── models/       # Mongoose Schemas (15 موديل)
│   ├── controllers/  # منطق الأعمال لكل موديول (17 كنترولر)
│   ├── routes/       # مسارات الـ API (19 راوت)
│   ├── middlewares/  # auth, customerAuth, error handler, upload
│   ├── services/     # otpService, notificationService (Mock - جاهزين للربط الحقيقي)
│   └── ...
├── scripts/seed.js   # سكريبت تعبئة بيانات حقيقية
└── server.js
```

## الـ Endpoints الرئيسية
| Method | Route | الوصف |
|---|---|---|
| POST | /api/admin/auth/login | دخول الأدمن |
| POST | /api/customers/auth/otp/send | إرسال كود تحقق للعميل |
| POST | /api/customers/auth/otp/verify | تأكيد الكود ودخول/تسجيل العميل |
| GET | /api/branches | الفروع |
| GET | /api/items?branch=&category= | الأصناف |
| POST | /api/orders | إنشاء طلب (يتطلب تسجيل دخول عميل) |
| PATCH | /api/orders/:id/status | تحديث حالة الطلب (أدمن) |
| GET | /api/coupons/validate?code=&branch= | التحقق من كوبون |
| GET | /api/delivery-zones?branch= | مناطق التوصيل ورسومها (عام) |
| GET | /api/admin/reports/overview | نظرة عامة للوحة التحكم |

## ⚠️ خدمات Mock جاهزة للربط الحقيقي
- `src/services/otpService.js` — حاليًا بيطبع الكود في الـ console. للربط الحقيقي: Twilio أو WhatsApp Cloud API
- `src/services/notificationService.js` — نفس المبدأ لإشعارات حالة الطلب
- `src/middlewares/upload.js` — تخزين محلي حاليًا. للإنتاج: Cloudinary أو AWS S3
