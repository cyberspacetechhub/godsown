const asyncHandler = require('../utils/asyncHandler');
const orderService = require('../services/orderService');

exports.trackOrder = asyncHandler(async (req, res) => {
  const { email, orderId } = req.query;
  const order = await orderService.trackOrder(orderId, email);
  res.status(200).json({ success: true, data: order });
});
