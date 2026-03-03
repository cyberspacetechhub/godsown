const asyncHandler = require('../utils/asyncHandler');
const foodService = require('../services/foodService');
const { validateFoodInput } = require('../validators/serviceValidator');

exports.createFood = asyncHandler(async (req, res) => {
  const foodData = validateFoodInput(req.body);
  const food = await foodService.createFood(foodData);
  res.status(201).json({ success: true, data: food });
});

exports.getFoodById = asyncHandler(async (req, res) => {
  const food = await foodService.getFoodById(req.params.id);
  res.status(200).json({ success: true, data: food });
});

exports.updateFood = asyncHandler(async (req, res) => {
  const foodData = validateFoodInput(req.body, true);
  const food = await foodService.updateFood(req.params.id, foodData);
  res.status(200).json({ success: true, data: food });
});

exports.deleteFood = asyncHandler(async (req, res) => {
  await foodService.deleteFood(req.params.id);
  res.status(200).json({ success: true, message: 'Food deleted' });
});

exports.getAllFoods = asyncHandler(async (req, res) => {
  const foods = await foodService.getAllFoods(req.query);
  res.status(200).json({ success: true, data: foods });
});
