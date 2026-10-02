const express = require('express');
const router = express.Router();
const { protectAdmin, authorize } = require('../middlewares/auth');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
router.get('/', getCategories);
router.post('/', protectAdmin, authorize('super_admin'), createCategory);
router.put('/:id', protectAdmin, authorize('super_admin'), updateCategory);
router.delete('/:id', protectAdmin, authorize('super_admin'), deleteCategory);
module.exports = router;
