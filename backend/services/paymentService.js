const Payment = require('../models/food-service/Payment');
const HotelPayment = require('../models/hotel-service/HotelPayment');
const { initializePayment, verifyPayment } = require('../utils/paystackConfig');
const AppError = require('../utils/AppError');

const createPayment = async (paymentData, Model = Payment) => {
  if (paymentData.paymentMethod === 'paystack') {
    const reference = `PAY-${Date.now()}`;
    const paystackResponse = await initializePayment(
      paymentData.email,
      paymentData.amount,
      reference
    );
    paymentData.transactionId = reference;
    paymentData.status = 'pending';
    const payment = await Model.create(paymentData);
    return { payment, authorizationUrl: paystackResponse.data.authorization_url };
  }
  return await Model.create(paymentData);
};

const verifyPaystackPayment = async (reference, Model = Payment) => {
  const verification = await verifyPayment(reference);
  if (verification.data.status === 'success') {
    const payment = await Model.findOneAndUpdate(
      { transactionId: reference },
      { status: 'success' },
      { new: true }
    );
    if (!payment) throw new AppError('Payment not found', 404);
    return payment;
  }
  throw new AppError('Payment verification failed', 400);
};

const getPaymentById = async (id, Model = Payment) => {
  const payment = await Model.findById(id);
  if (!payment) throw new AppError('Payment not found', 404);
  return payment;
};

const getAllPayments = async (filters = {}, Model = Payment) => {
  return await Model.find(filters);
};

module.exports = {
  createPayment,
  verifyPaystackPayment,
  getPaymentById,
  getAllPayments
};
