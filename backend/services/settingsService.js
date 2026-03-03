const Settings = require('../models/Settings');
const AppError = require('../utils/AppError');

const getAllSettings = async () => {
  return await Settings.find().sort({ category: 1, key: 1 });
};

const getPublicSettings = async () => {
  return await Settings.find({ isPublic: true }).sort({ category: 1, key: 1 });
};

const getSettingsByCategory = async (category) => {
  return await Settings.find({ category }).sort({ key: 1 });
};

const updateSettings = async (settingsData) => {
  const updates = [];
  
  for (const [key, value] of Object.entries(settingsData)) {
    const setting = await Settings.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    updates.push(setting);
  }
  
  return updates;
};

const getSetting = async (key) => {
  const setting = await Settings.findOne({ key });
  return setting ? setting.value : null;
};

module.exports = {
  getAllSettings,
  getPublicSettings,
  getSettingsByCategory,
  updateSettings,
  getSetting
};