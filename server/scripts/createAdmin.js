require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../src/models/Admin');
const connectDB = require('../src/config/db');

async function createInitialAdmin() {
  const name = process.env.INITIAL_ADMIN_NAME?.trim();
  const username = process.env.INITIAL_ADMIN_USERNAME?.trim();
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!name || !username || !password || password.length < 12) {
    throw new Error('Set INITIAL_ADMIN_NAME, INITIAL_ADMIN_USERNAME and a password of at least 12 characters.');
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('Set a private JWT_SECRET of at least 32 characters before creating an admin.');
  }
  await connectDB();
  if (await Admin.exists({ role: 'super_admin', isActive: true })) {
    throw new Error('An active super admin already exists. No account was changed.');
  }
  if (await Admin.exists({ username })) {
    throw new Error('This username already exists. No account was changed.');
  }
  await Admin.create({ name, username, password: await bcrypt.hash(password, 12), role: 'super_admin', isActive: true });
  console.log('Initial admin created. Remove INITIAL_ADMIN_* values from your environment.');
}

if (require.main === module) {
  createInitialAdmin().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  }).finally(() => mongoose.disconnect());
}

module.exports = { createInitialAdmin };
