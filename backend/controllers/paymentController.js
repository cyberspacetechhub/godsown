const asyncHandler = require('../utils/asyncHandler');
const paymentService = require('../services/paymentService');
const { validatePaymentInput } = require('../validators/serviceValidator');
const Payment = require('../models/food-service/Payment');
const HotelPayment = require('../models/hotel-service/HotelPayment');

exports.createPayment = asyncHandler(async (req, res) => {
  const paymentData = validatePaymentInput(req.body);
  const Model = req.body.type === 'hotel' ? HotelPayment : Payment;
  const result = await paymentService.createPayment(paymentData, Model);
  res.status(201).json({ success: true, data: result });
});

exports.verifyPayment = asyncHandler(async (req, res) => {
  const { reference, type } = req.query;
  const Model = type === 'hotel' ? HotelPayment : Payment;
  const payment = await paymentService.verifyPaystackPayment(reference, Model);
  res.status(200).json({ success: true, data: payment });
});

exports.getPaymentById = asyncHandler(async (req, res) => {
  const Model = req.query.type === 'hotel' ? HotelPayment : Payment;
  const payment = await paymentService.getPaymentById(req.params.id, Model);
  res.status(200).json({ success: true, data: payment });
});

exports.getAllPayments = asyncHandler(async (req, res) => {
  const { type, ...filters } = req.query;
  const Model = type === 'hotel' ? HotelPayment : Payment;
  const payments = await paymentService.getAllPayments(filters, Model);
  res.status(200).json({ success: true, data: payments });
});
