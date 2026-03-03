const mongoose = require('mongoose');

const RoomTypeSchema = new mongoose.Schema({
    roomType: { type: String, required: true, unique: true },
    roomNumbers: [{
        number: { type: String, required: true },
        isAvailable: { type: Boolean, default: true },
        assignedGuest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', default: null },
        assignedBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null }
    }],
    pricePerNight: { type: Number, required: true },
    capacity: { type: Number, required: true },
    description: { type: String, required: true },
    amenities: [String]
}, { timestamps: true });

module.exports = mongoose.model('RoomType', RoomTypeSchema);
