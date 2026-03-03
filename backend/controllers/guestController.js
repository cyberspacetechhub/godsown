const asyncHandler = require('../utils/asyncHandler');
const guestService = require('../services/guestService');
const { validateGuestInput } = require('../validators/serviceValidator');
const jwt = require('jsonwebtoken');
const Guest = require('../models/hotel-service/Guest');
const Booking = require('../models/hotel-service/Booking');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.registerGuest = asyncHandler(async (req, res) => {
  const { name, email, phone, password, address } = req.body;
  
  const existingGuest = await Guest.findOne({ email });
  if (existingGuest) {
    return res.status(400).json({ success: false, message: 'Guest already exists' });
  }

  const guest = await Guest.create({ name, email, phone, password, address });
  const token = jwt.sign({ id: guest._id, role: 'guest' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  res.status(201).json({ success: true, data: { guest: { id: guest._id, name: guest.name, email: guest.email }, token } });
});

exports.staffRegisterGuest = asyncHandler(async (req, res) => {
  const { name, email, phone, address, roomNumber, checkInDate, checkOutDate } = req.body;
  
  const existingGuest = await Guest.findOne({ email });
  if (existingGuest) {
    return res.status(400).json({ success: false, message: 'Guest already exists' });
  }

  // Use phone as password for staff-registered guests
  const guest = await Guest.create({ 
    name, 
    email, 
    phone, 
    password: phone, 
    address,
    roomNumber,
    checkInDate,
    checkOutDate,
    status: 'active'
  });

  // Send email with login credentials
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Godsown Group Hotel - Your Login Credentials',
      html: `
        <h2>Welcome to Godsown Group Hotel!</h2>
        <p>Dear ${name},</p>
        <p>Your account has been created by our staff. Here are your login credentials:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${phone}</p>
        <p><strong>Room Number:</strong> ${roomNumber}</p>
        <p>You can login at: <a href="${process.env.FRONTEND_URL}/guest/login">${process.env.FRONTEND_URL}/guest/login</a></p>
        <p>We recommend changing your password after your first login.</p>
        <p>Best regards,<br/>Godsown Group Hotel Team</p>
      `
    });
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
  }

  res.status(201).json({ success: true, data: guest, message: 'Guest registered and email sent' });
});

exports.loginGuest = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const guest = await Guest.findOne({ email });
  if (!guest || !(await guest.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  guest.lastLogin = new Date();
  await guest.save();

  const token = jwt.sign({ id: guest._id, role: 'guest' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  res.status(200).json({ success: true, data: { guest: { id: guest._id, name: guest.name, email: guest.email, roomNumber: guest.roomNumber, status: guest.status }, token } });
});

exports.getGuestDashboard = asyncHandler(async (req, res) => {
  const guestId = req.user.id;
  const guest = await Guest.findById(guestId).select('-password');
  const bookings = await Booking.find({ guest: guestId }).populate('room').sort('-createdAt');
  
  res.status(200).json({ success: true, data: { guest, bookings } });
});

exports.generateWifiAccess = asyncHandler(async (req, res) => {
  const guestId = req.user.id;
  const guest = await Guest.findById(guestId);
  
  if (guest.status !== 'active') {
    return res.status(403).json({ success: false, message: 'Only active guests can access WiFi' });
  }

  const wifiCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);

  guest.wifiAccessCode = wifiCode;
  guest.wifiAccessExpiry = expiry;
  await guest.save();

  res.status(200).json({ success: true, data: { wifiCode, expiry } });
});

exports.requestRoomChange = asyncHandler(async (req, res) => {
  const guestId = req.user.id;
  const { newRoomId, reason } = req.body;
  
  // This would typically create a request ticket for staff to approve
  res.status(200).json({ success: true, message: 'Room change request submitted. Staff will contact you shortly.' });
});

exports.checkoutGuest = asyncHandler(async (req, res) => {
  const guestId = req.user.id;
  const guest = await Guest.findById(guestId);
  
  guest.status = 'checked-out';
  guest.checkOutDate = new Date();
  await guest.save();

  await Booking.updateMany({ guest: guestId, status: 'confirmed' }, { status: 'completed' });

  res.status(200).json({ success: true, message: 'Checkout successful' });
});

exports.getGuestBookings = asyncHandler(async (req, res) => {
  const guestId = req.user.id;
  const bookings = await Booking.find({ guest: guestId }).populate('room').sort('-createdAt');
  
  res.status(200).json({ success: true, data: bookings });
});

exports.cleanupOldGuests = asyncHandler(async (req, res) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const oldGuests = await Guest.find({ 
    status: 'checked-out',
    checkOutDate: { $lt: oneMonthAgo }
  });

  if (oldGuests.length > 0) {
    const fields = ['name', 'email', 'phone', 'address', 'roomNumber', 'checkInDate', 'checkOutDate', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(oldGuests);

    const csvDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(csvDir)) fs.mkdirSync(csvDir, { recursive: true });

    const filename = `guests_export_${Date.now()}.csv`;
    const filepath = path.join(csvDir, filename);
    fs.writeFileSync(filepath, csv);

    await Guest.deleteMany({ _id: { $in: oldGuests.map(g => g._id) } });

    res.status(200).json({ success: true, message: `${oldGuests.length} guests archived`, file: filename });
  } else {
    res.status(200).json({ success: true, message: 'No old guests to cleanup' });
  }
});

exports.createGuest = asyncHandler(async (req, res) => {
  const guestData = validateGuestInput(req.body);
  const guest = await guestService.createGuest(guestData);
  res.status(201).json({ success: true, data: guest });
});

exports.getGuestById = asyncHandler(async (req, res) => {
  const guest = await guestService.getGuestById(req.params.id);
  res.status(200).json({ success: true, data: guest });
});

exports.updateGuest = asyncHandler(async (req, res) => {
  const guestData = validateGuestInput(req.body, true);
  const guest = await guestService.updateGuest(req.params.id, guestData);
  res.status(200).json({ success: true, data: guest });
});

exports.getAllGuests = asyncHandler(async (req, res) => {
  const guests = await guestService.getAllGuests(req.query);
  res.status(200).json({ success: true, data: guests });
});
