const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middlewares/auth');
const { getPriceChangeLogs } = require('../controllers/priceLogController');
router.get('/', protectAdmin, getPriceChangeLogs);
module.exports = router;
