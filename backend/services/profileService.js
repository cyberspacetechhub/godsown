const Profile = require('../models/portfolio-service/Profile');
const AppError = require('../utils/AppError');

const createProfile = async (profileData) => {
  return await Profile.create(profileData);
};

const getProfile = async () => {
  const profiles = await Profile.find();
  return profiles;
};

const updateProfile = async (id, updateData) => {
  const profile = await Profile.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!profile) throw new AppError('Profile not found', 404);
  return profile;
};

const deleteProfile = async (id) => {
  const profile = await Profile.findByIdAndDelete(id);
  if (!profile) throw new AppError('Profile not found', 404);
  return profile;
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile
};
