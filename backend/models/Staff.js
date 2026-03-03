const mongoose = require('mongoose');
const User = require('./User');

const Staff = User.discriminator('Staff', new mongoose.Schema({
    position: { type: String, required: true },
    department: { type: String, enum: ['hotel', 'restaurant'], required: true },
    salary: { type: Number },
    shift: { type: String, enum: ['morning', 'afternoon', 'night'] }
}));

module.exports = Staff;
