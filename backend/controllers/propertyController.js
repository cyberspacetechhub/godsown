const asyncHandler = require('../utils/asyncHandler');
const propertyService = require('../services/propertyService');
const { validatePropertyInput } = require('../validators/serviceValidator');

exports.createProperty = asyncHandler(async (req, res) => {
  const propertyData = validatePropertyInput(req.body);
  const property = await propertyService.createProperty(propertyData);
  res.status(201).json({ success: true, data: property });
});

exports.getPropertyById = asyncHandler(async (req, res) => {
  const property = await propertyService.getPropertyById(req.params.id);
  res.status(200).json({ success: true, data: property });
});

exports.updateProperty = asyncHandler(async (req, res) => {
  const propertyData = validatePropertyInput(req.body, true);
  const property = await propertyService.updateProperty(req.params.id, propertyData);
  res.status(200).json({ success: true, data: property });
});

exports.deleteProperty = asyncHandler(async (req, res) => {
  await propertyService.deleteProperty(req.params.id);
  res.status(200).json({ success: true, message: 'Property deleted' });
});

exports.getAllProperties = asyncHandler(async (req, res) => {
  const properties = await propertyService.getAllProperties(req.query);
  res.status(200).json({ success: true, data: properties });
});
