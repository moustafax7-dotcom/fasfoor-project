const express = require('express');
const router = express.Router();
const { adminLoginLimiter } = require('../middlewares/rateLimiter');
const { loginAdmin } = require('../controllers/authController');
router.post('/login', adminLoginLimiter, loginAdmin);
module.exports = router;
