const mongoose = require('mongoose');
const User = require('./User');

const Admin = User.discriminator('Admin', new mongoose.Schema({
    permissions: [{ type: String }],
    department: { type: String }
}));

module.exports = Admin;
