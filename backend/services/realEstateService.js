const Property = require('../models/realestate-service/Property');
const Inquiry = require('../models/realestate-service/Inquiry');
const Agent = require('../models/realestate-service/Agent');
const AppError = require('../utils/AppError');

// Property operations
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

// Inquiry operations
const createInquiry = async (inquiryData) => {
  return await Inquiry.create(inquiryData);
};

const getInquiriesByProperty = async (propertyId) => {
  return await Inquiry.find({ property: propertyId }).populate('property');
};

const getAllInquiries = async (filters = {}) => {
  return await Inquiry.find(filters).populate('property');
};

// Agent operations
const createAgent = async (agentData) => {
  return await Agent.create(agentData);
};

const getAgentById = async (id) => {
  const agent = await Agent.findById(id).populate('assignedProperties');
  if (!agent) throw new AppError('Agent not found', 404);
  return agent;
};

const assignPropertyToAgent = async (agentId, propertyId) => {
  const agent = await Agent.findByIdAndUpdate(
    agentId,
    { $addToSet: { assignedProperties: propertyId } },
    { new: true }
  );
  if (!agent) throw new AppError('Agent not found', 404);
  return agent;
};

module.exports = {
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getAllProperties,
  createInquiry,
  getInquiriesByProperty,
  getAllInquiries,
  createAgent,
  getAgentById,
  assignPropertyToAgent
};
