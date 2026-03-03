const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/foods', require('./foodRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/payments', require('./paymentRoutes'));
router.use('/rooms', require('./roomRoutes'));
router.use('/guests', require('./guestRoutes'));
router.use('/bookings', require('./bookingRoutes'));
router.use('/properties', require('./propertyRoutes'));
router.use('/inquiries', require('./inquiryRoutes'));
router.use('/profiles', require('./profileRoutes'));
router.use('/media', require('./mediaRoutes'));
router.use('/events', require('./eventRoutes'));
router.use('/upload', require('./uploadRoutes'));
router.use('/tracking', require('./trackingRoutes'));
router.use('/settings', require('./settingsRoutes'));

module.exports = router;
