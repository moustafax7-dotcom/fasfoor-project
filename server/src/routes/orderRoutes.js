const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middlewares/auth');
const { protectCustomer } = require('../middlewares/customerAuth');
const { getOrders, getOrderById, createOrder, updateOrderStatus } = require('../controllers/orderController');
router.get('/', protectAdmin, getOrders);
router.get('/:id', protectCustomer, getOrderById);
router.post('/', protectCustomer, createOrder); // لازم العميل يكون مسجل دخول (OTP) عشان يعمل طلب
router.patch('/:id/status', protectAdmin, updateOrderStatus);
module.exports = router;
