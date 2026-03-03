const Media = require('../models/portfolio-service/Media');
const AppError = require('../utils/AppError');

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

module.exports = {
  createMedia,
  getMediaById,
  getAllMedia,
  deleteMedia
};
