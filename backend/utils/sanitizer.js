const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return email;
  return email.trim().toLowerCase();
};

const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return phone;
  return phone.trim().replace(/[^\d+\s()-]/g, '');
};

const sanitizeNumber = (num) => {
  const parsed = parseFloat(num);
  return isNaN(parsed) ? 0 : parsed;
};

const sanitizeObject = (obj, fields) => {
  const sanitized = {};
  fields.forEach(field => {
    if (obj[field] !== undefined) {
      sanitized[field] = typeof obj[field] === 'string' ? sanitizeString(obj[field]) : obj[field];
    }
  });
  return sanitized;
};

module.exports = {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeNumber,
  sanitizeObject
};
