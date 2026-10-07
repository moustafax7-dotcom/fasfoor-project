const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`المسار غير موجود - ${req.originalUrl}`));
};
const errorHandler = (err, req, res, next) => {
  const statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413
    : err.name === 'MulterError' || err.name === 'ValidationError' || err.name === 'CastError' ? 400
    : err.code === 11000 ? 409
    : err.status || (res.statusCode >= 400 ? res.statusCode : 500);
  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'حدث خطأ في الخادم، حاول مرة أخرى لاحقًا' : err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
module.exports = { notFound, errorHandler };
