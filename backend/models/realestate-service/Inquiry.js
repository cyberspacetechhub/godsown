const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', InquirySchema);
