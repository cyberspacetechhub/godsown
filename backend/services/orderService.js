const Order = require('../models/food-service/Order');
const OrderItem = require('../models/food-service/OrderItem');
const Customer = require('../models/food-service/Customer');
const Food = require('../models/food-service/Food');
const AppError = require('../utils/AppError');

const createOrder = async (orderData, items, customerData) => {
  let customer = await Customer.findOne({ email: customerData.email });
  if (!customer) {
    customer = await Customer.create(customerData);
  }
  
  orderData.customer = customer._id;
  const order = await Order.create(orderData);
  const orderItems = items.map(item => ({ ...item, order: order._id }));
  await OrderItem.insertMany(orderItems);
  
  // Update totalSold for each food item
  for (const item of items) {
    await Food.findByIdAndUpdate(
      item.food,
      { $inc: { totalSold: item.quantity } }
    );
  }
  
  return order;
};

const getOrderById = async (id) => {
  const order = await Order.findById(id).populate('customer');
  if (!order) throw new AppError('Order not found', 404);
  const items = await OrderItem.find({ order: id }).populate('food');
  return { ...order.toObject(), items };
};

const trackOrder = async (orderId, email) => {
  const order = await Order.findById(orderId).populate('customer');
  if (!order) throw new AppError('Order not found', 404);
  
  const customer = await Customer.findById(order.customer);
  if (customer.email !== email) throw new AppError('Unauthorized', 403);
  
  const items = await OrderItem.find({ order: orderId }).populate('food');
  return { ...order.toObject(), items };
};

const updateOrder = async (id, updateData) => {
  const order = await Order.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!order) throw new AppError('Order not found', 404);
  return order;
};

const getAllOrders = async (filters = {}) => {
  return await Order.find(filters).populate('customer');
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  getAllOrders,
  trackOrder
};
