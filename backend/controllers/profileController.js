const asyncHandler = require('../utils/asyncHandler');
const profileService = require('../services/profileService');
const { validateProfileInput } = require('../validators/serviceValidator');

exports.createProfile = asyncHandler(async (req, res) => {
  const profileData = validateProfileInput(req.body);
  const profile = await profileService.createProfile(profileData);
  res.status(201).json({ success: true, data: profile });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getProfile();
  res.status(200).json({ success: true, data: profile });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const profileData = validateProfileInput(req.body, true);
  const profile = await profileService.updateProfile(req.params.id, profileData);
  res.status(200).json({ success: true, data: profile });
});

exports.deleteProfile = asyncHandler(async (req, res) => {
  await profileService.deleteProfile(req.params.id);
  res.status(200).json({ success: true, message: 'Profile deleted successfully' });
});
