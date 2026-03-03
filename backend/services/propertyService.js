const Property = require('../models/realestate-service/Property');
const AppError = require('../utils/AppError');

const createProperty = async (propertyData) => {
  return await Property.create(propertyData);
};

const getPropertyById = async (id) => {
  const property = await Property.findById(id);
  if (!property) throw new AppError('Property not found', 404);
  return property;
};

const updateProperty = async (id, updateData) => {
  const property = await Property.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!property) throw new AppError('Property not found', 404);
  return property;
};

const deleteProperty = async (id) => {
  const property = await Property.findByIdAndDelete(id);
  if (!property) throw new AppError('Property not found', 404);
  return property;
};

const getAllProperties = async (filters = {}) => {
  return await Property.find(filters);
};

module.exports = {
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getAllProperties
};
