const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middlewares/auth');
const { getCustomers, getCustomerOrders } = require('../controllers/customerController');
router.get('/', protectAdmin, getCustomers);
router.get('/:id/orders', protectAdmin, getCustomerOrders);
module.exports = router;
