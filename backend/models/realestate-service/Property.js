const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    propertyType: { type: String, enum: ['apartment', 'house', 'land', 'commercial'], required: true },
    status: { type: String, enum: ['available', 'sold', 'rented'], default: 'available' },
    imageUrls: [{ type: String }],
    agent: {
        name: { type: String },
        email: { type: String },
        phone: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);
