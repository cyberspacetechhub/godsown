const User = require('../models/User');
const Admin = require('../models/Admin');
const Staff = require('../models/Staff');
const Guest = require('../models/hotel-service/Guest');
const AppError = require('../utils/AppError');

const createUser = async (userData, role) => {
  const Model = { Admin, Guest, Staff }[role] || User;
  const user = await Model.create(userData);
  return user;
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const updateUser = async (id, updateData) => {
  // First find the user to get their role
  const existingUser = await User.findById(id);
  if (!existingUser) throw new AppError('User not found', 404);
  
  // Use the appropriate model based on role
  const Model = { Admin, Guest, Staff }[existingUser.role] || User;
  const user = await Model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const getAllUsers = async (filters = {}) => {
  return await User.find(filters);
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserByEmail
};
