require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const corsOptions = require('./config/corsOptions');
const connectDb = require('./config/connectDb');
const credentials = require('./middlewares/credentials');
const verifyApiKey = require('./middlewares/verifyApiKey');
const errorHandler = require('./middlewares/errorHandler');
const { generalLimiter } = require('./middlewares/rateLimiter');

const app = express();
const http = require('http');
const server = http.createServer(app);
const { initializeSocket } = require('./config/socket');
const PORT = process.env.PORT || 5000;

connectDb();
initializeSocket(server);
require('./jobs/guestCleanup'); // Initialize guest cleanup cron job

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/create-admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'createAdmin.html'));
});

app.use('/api', require('./routes'));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.use(errorHandler);

mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB');
  
  // Initialize default settings
  const seedSettings = require('./utils/seedSettings');
  await seedSettings();
  
  // Update existing bookings with calculated amounts
  const updateBookingAmounts = require('./utils/updateBookingAmounts');
  await updateBookingAmounts();
  
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
