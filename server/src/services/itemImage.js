const { createHash, randomUUID } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

const uploadDirectory = path.join(__dirname, '../../uploads');
const signatures = {
  'image/jpeg': (buffer) => buffer.length >= 3 && buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])),
  'image/png': (buffer) => buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  'image/webp': (buffer) => buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP',
};

async function saveItemImage(file) {
  if (!file) return undefined;
  if (!signatures[file.mimetype]?.(file.buffer)) {
    const error = new Error('محتوى الملف ليس صورة مدعومة');
    error.status = 400;
    throw error;
  }

  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
  if (cloud && key && secret) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHash('sha1').update(`timestamp=${timestamp}${secret}`).digest('hex');
    const body = new FormData();
    body.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
    body.append('timestamp', String(timestamp));
    body.append('api_key', key);
    body.append('signature', signature);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/image/upload`, {
      method: 'POST', body, signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    if (!response.ok || !result.secure_url) {
      const error = new Error('تعذر تخزين الصورة، حاول مرة أخرى');
      error.status = 502;
      throw error;
    }
    return result.secure_url;
  }

  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    const error = new Error('رفع الصور يحتاج تفعيل التخزين السحابي');
    error.status = 503;
    throw error;
  }
  await fs.mkdir(uploadDirectory, { recursive: true });
  const extension = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }[file.mimetype];
  const filename = `${randomUUID()}${extension}`;
  await fs.writeFile(path.join(uploadDirectory, filename), file.buffer);
  return `/uploads/${filename}`;
}

module.exports = { saveItemImage };
