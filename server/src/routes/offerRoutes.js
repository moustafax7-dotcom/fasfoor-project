const express = require('express');
const router = express.Router();
const { protectAdmin, authorize } = require('../middlewares/auth');
const { getOffers, createOffer, updateOffer, deleteOffer } = require('../controllers/offerController');
router.get('/', getOffers);
router.post('/', protectAdmin, authorize('super_admin'), createOffer);
router.put('/:id', protectAdmin, authorize('super_admin'), updateOffer);
router.delete('/:id', protectAdmin, authorize('super_admin'), deleteOffer);
module.exports = router;
