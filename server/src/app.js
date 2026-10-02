const express = require('express');
const cors = require('cors');
const path = require('path');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const branchRoutes = require('./routes/branchRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const itemRoutes = require('./routes/itemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const offerRoutes = require('./routes/offerRoutes');
const customerRoutes = require('./routes/customerRoutes');
const customerAuthRoutes = require('./routes/customerAuthRoutes');
const reportRoutes = require('./routes/reportRoutes');
const deliveryZoneRoutes = require('./routes/deliveryZoneRoutes');
const deliveryRepRoutes = require('./routes/deliveryRepRoutes');
const publicDeliveryRoutes = require('./routes/publicDeliveryRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const couponRoutes = require('./routes/couponRoutes');
const loyaltyRoutes = require('./routes/loyaltyRoutes');
const roleRoutes = require('./routes/roleRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const priceLogRoutes = require('./routes/priceLogRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Fasfoor API is running' }));

app.use('/api/admin/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/admin/customers', customerRoutes);
app.use('/api/customers/auth', customerAuthRoutes);
app.use('/api/admin/reports', reportRoutes);
app.use('/api/admin/delivery-zones', deliveryZoneRoutes);
app.use('/api/admin/delivery-reps', deliveryRepRoutes);
app.use('/api/delivery-zones', publicDeliveryRoutes);
app.use('/api/admin/inventory', inventoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/admin/roles', roleRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/price-logs', priceLogRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
