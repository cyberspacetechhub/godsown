const RoomType = require('../models/hotel-service/Room');
const AppError = require('../utils/AppError');

const createRoomType = async (roomData) => {
  const { roomType, roomNumber, capacity, pricePerNight, description, amenities } = roomData;
  
  const roomNumbers = roomNumber.split(',').map(num => ({
    number: num.trim(),
    isAvailable: true
  }));
  
  return await RoomType.create({
    roomType,
    roomNumbers,
    capacity,
    pricePerNight,
    description,
    amenities
  });
};

const getAllRoomTypes = async () => {
  return await RoomType.find();
};

const assignRoomToGuest = async (roomTypeId, roomNumber, guestId, bookingId) => {
  const roomType = await RoomType.findById(roomTypeId);
  if (!roomType) throw new AppError('Room type not found', 404);
  
  const room = roomType.roomNumbers.find(r => r.number === roomNumber);
  if (!room || !room.isAvailable) throw new AppError('Room not available', 400);
  
  room.isAvailable = false;
  room.assignedGuest = guestId;
  room.assignedBooking = bookingId;
  
  await roomType.save();
  return roomType;
};

const releaseRoom = async (roomTypeId, roomNumber) => {
  const roomType = await RoomType.findById(roomTypeId);
  if (!roomType) throw new AppError('Room type not found', 404);
  
  const room = roomType.roomNumbers.find(r => r.number === roomNumber);
  if (room) {
    room.isAvailable = true;
    room.assignedGuest = null;
    room.assignedBooking = null;
    await roomType.save();
  }
  
  return roomType;
};

module.exports = {
  createRoomType,
  getAllRoomTypes,
  assignRoomToGuest,
  releaseRoom
};
