const express = require('express');
const router = express.Router();
const { protectAdmin, authorize } = require('../middlewares/auth');
const { getReps, createRep, updateRep, deleteRep } = require('../controllers/deliveryRepController');
router.get('/', protectAdmin, getReps);
router.post('/', protectAdmin, authorize('super_admin', 'branch_manager'), createRep);
router.put('/:id', protectAdmin, authorize('super_admin', 'branch_manager'), updateRep);
router.delete('/:id', protectAdmin, authorize('super_admin'), deleteRep);
module.exports = router;
