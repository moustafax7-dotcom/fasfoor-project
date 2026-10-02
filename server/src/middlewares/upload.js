const multer = require('multer');
const path = require('path');

/**
 * تخزين محلي افتراضي (Disk Storage) - مناسب للتطوير فقط.
 * ⚠️ في الإنتاج: الصور هتضيع مع أي إعادة نشر (deploy) للسيرفر.
 * الحل: استخدم Cloudinary أو AWS S3. الاستبدال بسيط:
 *   1) npm install cloudinary multer-storage-cloudinary
 *   2) استبدل `storage` تحت بـ CloudinaryStorage، وحط مفاتيح CLOUDINARY_* في .env
 *   3) باقي الكود (upload.single/upload.array في الـ routes) يفضل زي ما هو من غير أي تغيير
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('صيغة الصورة غير مدعومة'), false);
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
