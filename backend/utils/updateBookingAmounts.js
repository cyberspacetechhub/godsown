const mongoose = require('mongoose');
const Booking = require('../models/hotel-service/Booking');
const RoomType = require('../models/hotel-service/Room');

const updateBookingAmounts = async () => {
  try {
    // console.log('Starting booking amount migration...');
    
    // Find all bookings without totalAmount or with totalAmount = 0
    const bookings = await Booking.find({
      $or: [
        { totalAmount: { $exists: false } },
        { totalAmount: 0 }
      ]
    });

    // console.log(`Found ${bookings.length} bookings to update`);

    for (const booking of bookings) {
      try {
        // Find the room type for this booking
        const roomType = await RoomType.findById(booking.roomTypeId);
        
        if (roomType) {
          // Calculate nights between check-in and check-out
          const checkIn = new Date(booking.checkInDate);
          const checkOut = new Date(booking.checkOutDate);
          const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
          
          // Calculate total amount
          const totalAmount = nights * roomType.pricePerNight;
          
          // Update the booking
          await Booking.findByIdAndUpdate(booking._id, { totalAmount });
          
          // console.log(`Updated booking ${booking._id}: ${nights} nights × ₦${roomType.pricePerNight} = ₦${totalAmount}`);
        } else {
          console.log(`Room type not found for booking ${booking._id}`);
        }
      } catch (error) {
        console.error(`Error updating booking ${booking._id}:`, error.message);
      }
    }
    
    // console.log('Booking amount migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

module.exports = updateBookingAmounts;