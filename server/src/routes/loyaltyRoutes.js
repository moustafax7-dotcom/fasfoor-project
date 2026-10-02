const express = require('express');
const router = express.Router();
const { protectAdmin, authorize } = require('../middlewares/auth');
const { getConfig, updateConfig } = require('../controllers/loyaltyController');
router.get('/config', getConfig);
router.put('/config', protectAdmin, authorize('super_admin'), updateConfig);
module.exports = router;
