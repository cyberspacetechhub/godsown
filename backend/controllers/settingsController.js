const asyncHandler = require('../utils/asyncHandler');
const settingsService = require('../services/settingsService');

exports.getAllSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getAllSettings();
  res.status(200).json({ success: true, data: settings });
});

exports.getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getPublicSettings();
  res.status(200).json({ success: true, data: settings });
});

exports.updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body);
  res.status(200).json({ success: true, data: settings });
});

exports.getSettingsByCategory = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettingsByCategory(req.params.category);
  res.status(200).json({ success: true, data: settings });
});

exports.getWifiSettings = asyncHandler(async (req, res) => {
  const wifiSettings = await settingsService.getWifiSettings();
  res.status(200).json({ success: true, data: wifiSettings });
});