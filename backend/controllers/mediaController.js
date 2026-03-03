const asyncHandler = require('../utils/asyncHandler');
const mediaService = require('../services/mediaService');
const { validateMediaInput } = require('../validators/serviceValidator');

exports.createMedia = asyncHandler(async (req, res) => {
  const mediaData = validateMediaInput(req.body);
  const media = await mediaService.createMedia(mediaData);
  res.status(201).json({ success: true, data: media });
});

exports.getMediaById = asyncHandler(async (req, res) => {
  const media = await mediaService.getMediaById(req.params.id);
  res.status(200).json({ success: true, data: media });
});

exports.getAllMedia = asyncHandler(async (req, res) => {
  const media = await mediaService.getAllMedia(req.query);
  res.status(200).json({ success: true, data: media });
});

exports.deleteMedia = asyncHandler(async (req, res) => {
  await mediaService.deleteMedia(req.params.id);
  res.status(200).json({ success: true, message: 'Media deleted' });
});
