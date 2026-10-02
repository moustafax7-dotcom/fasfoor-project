const express = require('express');
const router = express.Router();
const { protectAdmin, authorize } = require('../middlewares/auth');
const {
  getInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem,
  recordSupply, recordStockCount, getMovements,
} = require('../controllers/inventoryController');
router.get('/', protectAdmin, getInventoryItems);
router.get('/movements', protectAdmin, getMovements);
router.post('/', protectAdmin, authorize('super_admin', 'branch_manager'), createInventoryItem);
router.put('/:id', protectAdmin, authorize('super_admin', 'branch_manager'), updateInventoryItem);
router.delete('/:id', protectAdmin, authorize('super_admin'), deleteInventoryItem);
router.post('/:id/supply', protectAdmin, authorize('super_admin', 'branch_manager'), recordSupply);
router.post('/:id/count', protectAdmin, authorize('super_admin', 'branch_manager'), recordStockCount);
module.exports = router;
