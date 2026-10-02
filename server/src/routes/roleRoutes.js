const express = require('express');
const router = express.Router();
const { protectAdmin, authorize } = require('../middlewares/auth');
const { getRoles, updatePermissions } = require('../controllers/roleController');
router.get('/', protectAdmin, getRoles);
router.put('/', protectAdmin, authorize('super_admin'), updatePermissions);
module.exports = router;
