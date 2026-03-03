const mongoose = require('mongoose');

const HotelPaymentSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['card', 'transfer', 'paystack', 'stripe'], required: true },
    transactionId: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('HotelPayment', HotelPaymentSchema);
