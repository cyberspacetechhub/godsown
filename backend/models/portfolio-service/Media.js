const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    type: { type: String, enum: ['photo', 'video', 'audio'], required: true },
    url: { type: String, required: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Media', MediaSchema);
