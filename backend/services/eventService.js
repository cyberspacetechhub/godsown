const Event = require('../models/portfolio-service/Event');
const AppError = require('../utils/AppError');

const createEvent = async (eventData) => {
  return await Event.create(eventData);
};

const getEventById = async (id) => {
  const event = await Event.findById(id);
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

const getAllEvents = async (filters = {}) => {
  return await Event.find(filters).sort({ date: -1 });
};

const updateEvent = async (id, updateData) => {
  const event = await Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

const deleteEvent = async (id) => {
  const event = await Event.findByIdAndDelete(id);
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

module.exports = {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent
};
