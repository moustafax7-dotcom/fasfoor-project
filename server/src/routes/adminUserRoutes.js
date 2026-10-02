const express = require('express');
const router = express.Router();
const { protectAdmin, authorize } = require('../middlewares/auth');
const { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } = require('../controllers/adminUserController');
router.get('/', protectAdmin, authorize('super_admin'), getAdminUsers);
router.post('/', protectAdmin, authorize('super_admin'), createAdminUser);
router.put('/:id', protectAdmin, authorize('super_admin'), updateAdminUser);
router.delete('/:id', protectAdmin, authorize('super_admin'), deleteAdminUser);
module.exports = router;
