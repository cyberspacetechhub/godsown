const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const GuestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    password: { type: String, required: true },
    roomNumber: { type: String },
    checkInDate: { type: Date },
    checkOutDate: { type: Date },
    wifiAccessCode: { type: String },
    wifiAccessExpiry: { type: Date },
    status: { type: String, enum: ['active', 'checked-out', 'inactive'], default: 'active' },
    lastLogin: { type: Date }
}, { timestamps: true });

GuestSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

GuestSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Guest', GuestSchema);
