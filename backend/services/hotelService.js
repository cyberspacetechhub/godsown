const Room = require('../models/hotel-service/Room');
const Guest = require('../models/hotel-service/Guest');
const Booking = require('../models/hotel-service/Booking');
const HotelPayment = require('../models/hotel-service/HotelPayment');
const AppError = require('../utils/AppError');

// Room operations
const createRoom = async (roomData) => {
  return await Room.create(roomData);
};

const getRoomById = async (id) => {
  const room = await Room.findById(id);
  if (!room) throw new AppError('Room not found', 404);
  return room;
};

const updateRoom = async (id, updateData) => {
  const room = await Room.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!room) throw new AppError('Room not found', 404);
  return room;
};

const deleteRoom = async (id) => {
  const room = await Room.findByIdAndDelete(id);
  if (!room) throw new AppError('Room not found', 404);
  return room;
};

const getAllRooms = async (filters = {}) => {
  return await Room.find(filters);
};

// Guest operations
const createGuest = async (guestData) => {
  return await Guest.create(guestData);
};

const getGuestById = async (id) => {
  const guest = await Guest.findById(id);
  if (!guest) throw new AppError('Guest not found', 404);
  return guest;
};

// Booking operations
const createBooking = async (bookingData) => {
  const room = await Room.findById(bookingData.room);
  if (room.status !== 'available') throw new AppError('Room not available', 400);
  
  const booking = await Booking.create(bookingData);
  await Room.findByIdAndUpdate(bookingData.room, { status: 'occupied' });
  return booking;
};

const getBookingById = async (id) => {
  const booking = await Booking.findById(id).populate('guest room');
  if (!booking) throw new AppError('Booking not found', 404);
  return booking;
};

const updateBooking = async (id, updateData) => {
  const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!booking) throw new AppError('Booking not found', 404);
  return booking;
};

const getAllBookings = async (filters = {}) => {
  return await Booking.find(filters).populate('guest room');
};

// Payment operations
const createPayment = async (paymentData) => {
  return await HotelPayment.create(paymentData);
};

const getPaymentByBooking = async (bookingId) => {
  return await HotelPayment.findOne({ booking: bookingId });
};

module.exports = {
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom,
  getAllRooms,
  createGuest,
  getGuestById,
  createBooking,
  getBookingById,
  updateBooking,
  getAllBookings,
  createPayment,
  getPaymentByBooking
};
