const Profile = require('../models/portfolio-service/Profile');
const Media = require('../models/portfolio-service/Media');
const Event = require('../models/portfolio-service/Event');
const AppError = require('../utils/AppError');

// Profile operations
const createProfile = async (profileData) => {
  return await Profile.create(profileData);
};

const getProfile = async () => {
  const profile = await Profile.findOne();
  if (!profile) throw new AppError('Profile not found', 404);
  return profile;
};

const updateProfile = async (id, updateData) => {
  const profile = await Profile.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!profile) throw new AppError('Profile not found', 404);
  return profile;
};

// Media operations
const createMedia = async (mediaData) => {
  return await Media.create(mediaData);
};

const getMediaById = async (id) => {
  const media = await Media.findById(id);
  if (!media) throw new AppError('Media not found', 404);
  return media;
};

const getAllMedia = async (filters = {}) => {
  return await Media.find(filters);
};

const deleteMedia = async (id) => {
  const media = await Media.findByIdAndDelete(id);
  if (!media) throw new AppError('Media not found', 404);
  return media;
};

// Event operations
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
  createProfile,
  getProfile,
  updateProfile,
  createMedia,
  getMediaById,
  getAllMedia,
  deleteMedia,
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent
};
