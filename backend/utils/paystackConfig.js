const axios = require('axios');
const AppError = require('./AppError');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const initializePayment = async (email, amount, reference) => {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100,
        reference,
        callback_url: process.env.PAYSTACK_CALLBACK_URL
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new AppError(error.response?.data?.message || 'Payment initialization failed', 400);
  }
};

const verifyPayment = async (reference) => {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new AppError(error.response?.data?.message || 'Payment verification failed', 400);
  }
};

module.exports = {
  initializePayment,
  verifyPayment
};
