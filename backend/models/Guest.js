const mongoose = require('mongoose');
const User = require('./User');

const Guest = User.discriminator('Guest', new mongoose.Schema({
  bookingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
}));

module.exports = Guest;
