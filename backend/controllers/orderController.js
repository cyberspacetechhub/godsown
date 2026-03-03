const asyncHandler = require('../utils/asyncHandler');
const orderService = require('../services/orderService');
const { validateOrderInput, validateGuestInput } = require('../validators/serviceValidator');

exports.createOrder = asyncHandler(async (req, res) => {
  const { items, customer, ...orderData } = req.body;
  validateGuestInput(customer);
  validateOrderInput(orderData);
  const order = await orderService.createOrder(orderData, items, customer);
  res.status(201).json({ success: true, data: order });
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  res.status(200).json({ success: true, data: order });
});

exports.updateOrder = asyncHandler(async (req, res) => {
  const orderData = validateOrderInput(req.body, true);
  const order = await orderService.updateOrder(req.params.id, orderData);
  res.status(200).json({ success: true, data: order });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders(req.query);
  res.status(200).json({ success: true, data: orders });
});
