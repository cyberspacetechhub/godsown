const Food = require('../models/food-service/Food');
const AppError = require('../utils/AppError');

const createFood = async (foodData) => {
  return await Food.create(foodData);
};

const getFoodById = async (id) => {
  const food = await Food.findById(id);
  if (!food) throw new AppError('Food not found', 404);
  return food;
};

const updateFood = async (id, updateData) => {
  const food = await Food.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!food) throw new AppError('Food not found', 404);
  return food;
};

const deleteFood = async (id) => {
  const food = await Food.findByIdAndDelete(id);
  if (!food) throw new AppError('Food not found', 404);
  return food;
};

const getAllFoods = async (filters = {}) => {
  return await Food.find(filters);
};

module.exports = {
  createFood,
  getFoodById,
  updateFood,
  deleteFood,
  getAllFoods
};
