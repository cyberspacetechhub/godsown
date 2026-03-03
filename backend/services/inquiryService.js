const Inquiry = require('../models/realestate-service/Inquiry');
const AppError = require('../utils/AppError');

const createInquiry = async (inquiryData) => {
  return await Inquiry.create(inquiryData);
};

const getInquiryById = async (id) => {
  const inquiry = await Inquiry.findById(id).populate('property');
  if (!inquiry) throw new AppError('Inquiry not found', 404);
  return inquiry;
};

const getInquiriesByProperty = async (propertyId) => {
  return await Inquiry.find({ property: propertyId }).populate('property');
};

const getAllInquiries = async (filters = {}) => {
  return await Inquiry.find(filters).populate('property');
};

module.exports = {
  createInquiry,
  getInquiryById,
  getInquiriesByProperty,
  getAllInquiries
};
