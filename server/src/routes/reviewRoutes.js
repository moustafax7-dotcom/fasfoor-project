const express = require('express');
const router = express.Router();
const { protectCustomer } = require('../middlewares/customerAuth');
const { protectAdmin } = require('../middlewares/auth');
const { createReview, getReviews } = require('../controllers/reviewController');
router.post('/', protectCustomer, createReview);
router.get('/admin', protectAdmin, getReviews);
module.exports = router;
