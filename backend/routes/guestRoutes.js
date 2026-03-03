const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const verifyJWT = require('../middlewares/verifyJwt');

// Public routes
router.post('/register', guestController.registerGuest);
router.post('/login', guestController.loginGuest);

// Protected guest routes
router.get('/dashboard', verifyJWT, guestController.getGuestDashboard);
router.post('/wifi-access', verifyJWT, guestController.generateWifiAccess);
router.post('/room-change', verifyJWT, guestController.requestRoomChange);
router.post('/checkout', verifyJWT, guestController.checkoutGuest);
router.get('/bookings', verifyJWT, guestController.getGuestBookings);

// Staff/Admin routes
router.post('/staff-register', guestController.staffRegisterGuest);
router.post('/', guestController.createGuest);
router.get('/', guestController.getAllGuests);
router.get('/:id', guestController.getGuestById);
router.put('/:id', guestController.updateGuest);
router.delete('/cleanup', guestController.cleanupOldGuests);

module.exports = router;
