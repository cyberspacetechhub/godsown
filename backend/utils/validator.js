const AppError = require('./AppError');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400);
  }
};

const validatePhone = (phone) => {
  if (phone && !/^\+?[\d\s-()]+$/.test(phone)) {
    throw new AppError('Invalid phone number format', 400);
  }
};

const validateRequired = (fields, data) => {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new AppError(`Missing required fields: ${missing.join(', ')}`, 400);
  }
};

const validateObjectId = (id) => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new AppError('Invalid ID format', 400);
  }
};

const validateEnum = (value, allowedValues, fieldName) => {
  if (!allowedValues.includes(value)) {
    throw new AppError(`Invalid ${fieldName}. Allowed values: ${allowedValues.join(', ')}`, 400);
  }
};

module.exports = {
  validateEmail,
  validatePhone,
  validateRequired,
  validateObjectId,
  validateEnum
};
