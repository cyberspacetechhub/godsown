const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['card', 'transfer', 'paystack', 'stripe'], required: true },
    transactionId: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
