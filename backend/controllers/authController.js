const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');
const { validateEmail } = require('../utils/validator');
const { sanitizeEmail } = require('../utils/sanitizer');

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const sanitizedEmail = sanitizeEmail(email);
  validateEmail(sanitizedEmail);

  const { user, accessToken, refreshToken } = await authService.login(sanitizedEmail, password);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        shift: user.shift
      },
      accessToken
    }
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

exports.refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Refresh token required' });
  }

  const { accessToken, user } = await authService.refresh(refreshToken);

  res.status(200).json({
    success: true,
    data: { accessToken, user }
  });
});
