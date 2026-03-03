const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
    roomTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomType' },
    roomNumber: { type: String },
    roomType: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
