const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid credentials', 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  if (user.status !== 'active') throw new AppError('Account is not active', 403);

  const accessToken = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.ACCESS_TOKEN,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN,
    { expiresIn: '7d' }
  );

  return { user, accessToken, refreshToken };
};

const refresh = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);
    const user = await User.findById(decoded.id);
    
    if (!user) throw new AppError('User not found', 404);
    if (user.status !== 'active') throw new AppError('Account is not active', 403);

    const accessToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.ACCESS_TOKEN,
      { expiresIn: '15m' }
    );

    return { 
      accessToken, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        shift: user.shift
      }
    };
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
};

module.exports = {
  login,
  refresh
};
