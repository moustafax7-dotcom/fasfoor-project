const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middlewares/auth');
const { getOverview, getBranchPerformance } = require('../controllers/reportController');
router.get('/overview', protectAdmin, getOverview);
router.get('/branch-performance', protectAdmin, getBranchPerformance);
module.exports = router;
