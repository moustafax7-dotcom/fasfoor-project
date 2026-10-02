const express = require('express');
const router = express.Router();
const { protectAdmin, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const {
  getItems, getItemById, createItem, updateItem, approveItemPrice, toggleAvailability, deleteItem,
} = require('../controllers/itemController');
router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', protectAdmin, authorize('super_admin', 'branch_manager'), upload.single('image'), createItem);
router.put('/:id', protectAdmin, authorize('super_admin', 'branch_manager'), upload.single('image'), updateItem);
router.patch('/:id/approve-price', protectAdmin, authorize('super_admin'), approveItemPrice);
router.patch('/:id/toggle-availability', protectAdmin, authorize('super_admin', 'branch_manager', 'staff'), toggleAvailability);
router.delete('/:id', protectAdmin, authorize('super_admin'), deleteItem);
module.exports = router;
