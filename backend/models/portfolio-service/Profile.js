const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    biography: { type: String },
    imageUrl: { type: String },
    socialLinks: {
        facebook: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        youtube: { type: String },
        website: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
