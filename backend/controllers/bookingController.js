const asyncHandler = require('../utils/asyncHandler');
const bookingService = require('../services/bookingService');
const roomService = require('../services/roomService');
const { validateBookingInput, validateGuestInput } = require('../validators/serviceValidator');
const Booking = require('../models/hotel-service/Booking');
const RoomType = require('../models/hotel-service/Room');
const Guest = require('../models/hotel-service/Guest');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.createBooking = asyncHandler(async (req, res) => {
  const { guest, ...bookingData } = req.body;
  validateGuestInput(guest);
  validateBookingInput(bookingData);
  const booking = await bookingService.createBooking(bookingData, guest);
  res.status(201).json({ success: true, data: booking });
});

exports.assignRoom = asyncHandler(async (req, res) => {
  const { bookingId, roomTypeId, roomNumber } = req.body;
  
  const booking = await Booking.findById(bookingId).populate('guest');
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  
  const roomType = await RoomType.findById(roomTypeId);
  if (!roomType) return res.status(404).json({ success: false, message: 'Room type not found' });
  
  const room = roomType.roomNumbers.find(r => r.number === roomNumber);
  if (!room || !room.isAvailable) {
    return res.status(400).json({ success: false, message: 'Room is not available' });
  }
  
  if (roomType.roomType !== booking.roomType) {
    return res.status(400).json({ success: false, message: 'Room type mismatch' });
  }
  
  booking.roomTypeId = roomTypeId;
  booking.roomNumber = roomNumber;
  booking.status = 'confirmed';
  booking.assignedBy = req.userId;
  booking.assignedAt = new Date();
  await booking.save();
  
  await roomService.assignRoomToGuest(roomTypeId, roomNumber, booking.guest._id, booking._id);
  
  const guest = await Guest.findById(booking.guest._id);
  guest.roomNumber = roomNumber;
  guest.status = 'active';
  await guest.save();
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: guest.email,
      subject: 'Room Assignment - Godsown Group Hotel',
      html: `
        <h2>Room Assignment Confirmation</h2>
        <p>Dear ${guest.name},</p>
        <p>Your room has been assigned!</p>
        <p><strong>Room Number:</strong> ${roomNumber}</p>
        <p><strong>Room Type:</strong> ${roomType.roomType}</p>
        <p><strong>Check-in:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}</p>
        <p><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}</p>
        <p>You can now access WiFi and other room services through your guest portal.</p>
        <p>Best regards,<br/>Godsown Group Hotel Team</p>
      `
    });
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
  }
  
  res.status(200).json({ success: true, data: booking, message: 'Room assigned successfully' });
});



exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id);
  res.status(200).json({ success: true, data: booking });
});

exports.updateBooking = asyncHandler(async (req, res) => {
  const bookingData = validateBookingInput(req.body, true);
  const booking = await bookingService.updateBooking(req.params.id, bookingData);
  res.status(200).json({ success: true, data: booking });
});

exports.getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getAllBookings(req.query);
  res.status(200).json({ success: true, data: bookings });
});
