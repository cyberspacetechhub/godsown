const Guest = require('../models/hotel-service/Guest');
const AppError = require('../utils/AppError');

const createGuest = async (guestData) => {
  return await Guest.create(guestData);
};

const getGuestById = async (id) => {
  const guest = await Guest.findById(id);
  if (!guest) throw new AppError('Guest not found', 404);
  return guest;
};

const updateGuest = async (id, updateData) => {
  const guest = await Guest.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!guest) throw new AppError('Guest not found', 404);
  return guest;
};

const getAllGuests = async (filters = {}) => {
  return await Guest.find(filters);
};

module.exports = {
  createGuest,
  getGuestById,
  updateGuest,
  getAllGuests
};
