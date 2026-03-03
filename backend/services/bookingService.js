const Booking = require('../models/hotel-service/Booking');
const RoomType = require('../models/hotel-service/Room');
const Guest = require('../models/hotel-service/Guest');
const roomService = require('./roomService');
const AppError = require('../utils/AppError');

const createBooking = async (bookingData, guestData) => {
  let guest = await Guest.findOne({ email: guestData.email });
  if (!guest) {
    guest = await Guest.create(guestData);
  }
  
  // Find room type and specific room number
  const roomType = await RoomType.findOne({ roomType: bookingData.roomType });
  if (!roomType) throw new AppError(`Room type ${bookingData.roomType} not found`, 404);
  
  const availableRoom = roomType.roomNumbers.find(room => 
    room.number === bookingData.roomNumber && room.isAvailable
  );
  if (!availableRoom) throw new AppError(`Room ${bookingData.roomNumber} not available`, 400);
  
  // Calculate total amount based on nights and room price
  const checkIn = new Date(bookingData.checkInDate);
  const checkOut = new Date(bookingData.checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const totalAmount = nights * roomType.pricePerNight;
  
  bookingData.guest = guest._id;
  bookingData.roomTypeId = roomType._id;
  bookingData.totalAmount = totalAmount;
  
  const booking = await Booking.create(bookingData);
  
  // Assign room to guest
  await roomService.assignRoomToGuest(roomType._id, bookingData.roomNumber, guest._id, booking._id);
  
  guest.roomNumber = bookingData.roomNumber;
  guest.status = 'active';
  await guest.save();
  
  return booking;
};

const getBookingById = async (id) => {
  const booking = await Booking.findById(id).populate('guest');
  if (!booking) throw new AppError('Booking not found', 404);
  return booking;
};

const updateBooking = async (id, updateData) => {
  const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!booking) throw new AppError('Booking not found', 404);
  return booking;
};

const getAllBookings = async (filters = {}) => {
  return await Booking.find(filters).populate('guest');
};

module.exports = {
  createBooking,
  getBookingById,
  updateBooking,
  getAllBookings
};
