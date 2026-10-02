const express = require('express');
const router = express.Router();
const { protectAdmin, authorize } = require('../middlewares/auth');
const { getZones, createZone, updateZone, deleteZone } = require('../controllers/deliveryZoneController');
router.get('/', protectAdmin, getZones);
router.post('/', protectAdmin, authorize('super_admin', 'branch_manager'), createZone);
router.put('/:id', protectAdmin, authorize('super_admin', 'branch_manager'), updateZone);
router.delete('/:id', protectAdmin, authorize('super_admin'), deleteZone);
module.exports = router;
