const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/userService');
const { validateUserInput, validateAdminInput, validateStaffInput, validateGuestInput } = require('../validators/userValidator');

exports.createUser = asyncHandler(async (req, res) => {
  const { role, ...userData } = req.body;
  validateUserInput(userData);
  
  if (role === 'Admin') validateAdminInput(userData);
  if (role === 'Guest') validateGuestInput(userData);
  if (role === 'Staff') validateStaffInput(userData);
  
  const user = await userService.createUser(userData, role);
  res.status(201).json({ success: true, data: user });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({ success: true, data: user });
});

exports.updateUser = asyncHandler(async (req, res) => {
  validateUserInput(req.body, true);
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(200).json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(200).json({ success: true, message: 'User deleted' });
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers(req.query);
  res.status(200).json({ success: true, data: users });
});
