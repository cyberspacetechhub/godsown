const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['combo deals', 'soft drink', 'protein', 'rice', 'soup'], required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    totalSold: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Food', FoodSchema);