const multer = require('multer');

const fileFilter = (req, file, callback) => {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
    return callback(null, true);
  }
  const error = new Error('صيغة الصورة غير مدعومة');
  error.status = 400;
  callback(error);
};

module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024, files: 1, fields: 20 },
});
