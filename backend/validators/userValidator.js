const { validateEmail, validatePhone, validateRequired, validateEnum } = require('../utils/validator');
const { sanitizeString, sanitizeEmail, sanitizePhone } = require('../utils/sanitizer');
const AppError = require('../utils/AppError');

const validateUserInput = (data, isUpdate = false) => {
  const requiredFields = isUpdate ? [] : ['name', 'email', 'password'];
  validateRequired(requiredFields, data);

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

  if (data.status) {
    validateEnum(data.status, ['active', 'inactive', 'suspended'], 'status');
  }

  if (data.password && data.password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  return data;
};

const validateAdminInput = (data) => {
  if (data.department) data.department = sanitizeString(data.department);
  return data;
};

const validateStaffInput = (data) => {
  if (data.position) data.position = sanitizeString(data.position);
  if (data.shift) {
    validateEnum(data.shift, ['morning', 'afternoon', 'night'], 'shift');
  }
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

module.exports = {
  validateUserInput,
  validateAdminInput,
  validateStaffInput,
  validateGuestInput
};
