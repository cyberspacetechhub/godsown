const AppError = require('../utils/AppError');

const checkShiftAccess = (req, res, next) => {
  const user = req.user;

  if (user.role !== 'Staff') {
    return next();
  }

  if (!user.shift) {
    return next(new AppError('No shift assigned. Contact administrator.', 403));
  }

  const currentHour = new Date().getHours();
  let allowedShift = null;

  if (currentHour >= 6 && currentHour < 14) {
    allowedShift = 'morning';
  } else if (currentHour >= 14 && currentHour < 22) {
    allowedShift = 'afternoon';
  } else {
    allowedShift = 'night';
  }

  if (user.shift !== allowedShift) {
    return next(new AppError(`Access denied. You are on ${user.shift} shift. Current shift is ${allowedShift}.`, 403));
  }

  next();
};

module.exports = checkShiftAccess;
