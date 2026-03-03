const { validateRequired, validateEnum, validateObjectId, validateEmail, validatePhone } = require('../utils/validator');
const { sanitizeString, sanitizeNumber, sanitizeEmail, sanitizePhone } = require('../utils/sanitizer');

// Food Service
const validateFoodInput = (data, isUpdate = false) => {
  if (!isUpdate) validateRequired(['name', 'category', 'price'], data);
  if (data.name) data.name = sanitizeString(data.name);
  if (data.description) data.description = sanitizeString(data.description);
  if (data.category) validateEnum(data.category, ['combo deals', 'soft drink', 'protein', 'rice', 'soup'], 'category');
  if (data.price !== undefined) data.price = sanitizeNumber(data.price);
  if (data.stockQuantity !== undefined) data.stockQuantity = sanitizeNumber(data.stockQuantity);
  return data;
};

const validateOrderInput = (data, isUpdate = false) => {
  if (!isUpdate) validateRequired(['totalAmount'], data);
  if (data.totalAmount !== undefined) data.totalAmount = sanitizeNumber(data.totalAmount);
  if (data.status) validateEnum(data.status, ['pending', 'confirmed', 'cancelled', 'delivered'], 'status');
  if (data.paymentStatus) validateEnum(data.paymentStatus, ['unpaid', 'paid', 'refunded'], 'paymentStatus');
  return data;
};

const validatePaymentInput = (data) => {
  validateRequired(['order', 'amount', 'paymentMethod'], data);
  validateObjectId(data.order);
  data.amount = sanitizeNumber(data.amount);
  validateEnum(data.paymentMethod, ['card', 'transfer', 'paystack', 'stripe'], 'paymentMethod');
  if (data.status) validateEnum(data.status, ['success', 'failed', 'pending'], 'status');
  return data;
};

// Hotel Service
const validateRoomInput = (data, isUpdate = false) => {
  if (!isUpdate) validateRequired(['roomNumber', 'roomType', 'pricePerNight', 'capacity', 'description'], data);
  if (data.roomNumber) data.roomNumber = sanitizeString(data.roomNumber);
  if (data.roomType) data.roomType = sanitizeString(data.roomType);
  if (data.pricePerNight !== undefined) data.pricePerNight = sanitizeNumber(data.pricePerNight);
  if (data.capacity !== undefined) data.capacity = sanitizeNumber(data.capacity);
  if (data.description) data.description = sanitizeString(data.description);
  return data;
};

const validateBookingInput = (data, isUpdate = false) => {
  if (!isUpdate) validateRequired(['roomType', 'checkInDate', 'checkOutDate'], data);
  if (data.status) validateEnum(data.status, ['pending', 'confirmed', 'cancelled', 'completed'], 'status');
  if (data.paymentStatus) validateEnum(data.paymentStatus, ['unpaid', 'paid', 'refunded'], 'paymentStatus');
  return data;
};

const validateGuestInput = (data, isUpdate = false) => {
  if (!isUpdate) validateRequired(['name', 'email', 'phone'], data);
  if (data.email) {
    data.email = sanitizeEmail(data.email);
    validateEmail(data.email);
  }
  if (data.phone) {
    data.phone = sanitizePhone(data.phone);
    validatePhone(data.phone);
  }
  if (data.name) data.name = sanitizeString(data.name);
  if (data.address) data.address = sanitizeString(data.address);
  return data;
};

// Real Estate Service
const validatePropertyInput = (data, isUpdate = false) => {
  if (!isUpdate) validateRequired(['title', 'location', 'price', 'propertyType'], data);
  if (data.title) data.title = sanitizeString(data.title);
  if (data.description) data.description = sanitizeString(data.description);
  if (data.location) data.location = sanitizeString(data.location);
  if (data.propertyType) validateEnum(data.propertyType, ['apartment', 'house', 'land', 'commercial'], 'propertyType');
  if (data.status) validateEnum(data.status, ['available', 'sold', 'rented'], 'status');
  if (data.price !== undefined) data.price = sanitizeNumber(data.price);
  return data;
};

const validateInquiryInput = (data) => {
  validateRequired(['property', 'customerName', 'customerEmail', 'customerPhone'], data);
  validateObjectId(data.property);
  data.customerName = sanitizeString(data.customerName);
  data.customerEmail = sanitizeEmail(data.customerEmail);
  validateEmail(data.customerEmail);
  data.customerPhone = sanitizePhone(data.customerPhone);
  validatePhone(data.customerPhone);
  if (data.message) data.message = sanitizeString(data.message);
  return data;
};

// Portfolio Service
const validateProfileInput = (data, isUpdate = false) => {
  if (!isUpdate) validateRequired(['name'], data);
  if (data.name) data.name = sanitizeString(data.name);
  if (data.biography) data.biography = sanitizeString(data.biography);
  return data;
};

const validateMediaInput = (data) => {
  validateRequired(['type', 'url'], data);
  validateEnum(data.type, ['photo', 'video', 'audio'], 'type');
  if (data.description) data.description = sanitizeString(data.description);
  return data;
};

const validateEventInput = (data, isUpdate = false) => {
  if (!isUpdate) validateRequired(['title', 'date', 'location'], data);
  if (data.title) data.title = sanitizeString(data.title);
  if (data.location) data.location = sanitizeString(data.location);
  if (data.description) data.description = sanitizeString(data.description);
  return data;
};

module.exports = {
  validateFoodInput,
  validateOrderInput,
  validatePaymentInput,
  validateRoomInput,
  validateBookingInput,
  validateGuestInput,
  validatePropertyInput,
  validateInquiryInput,
  validateProfileInput,
  validateMediaInput,
  validateEventInput
};
