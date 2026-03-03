const cron = require('node-cron');
const Guest = require('../models/hotel-service/Guest');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

// Run every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  try {
    console.log('Running guest cleanup job...');
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const oldGuests = await Guest.find({ 
      status: 'checked-out',
      checkOutDate: { $lt: oneMonthAgo }
    });

    if (oldGuests.length > 0) {
      const fields = ['name', 'email', 'phone', 'address', 'roomNumber', 'checkInDate', 'checkOutDate', 'createdAt', 'updatedAt'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(oldGuests);

      const csvDir = path.join(__dirname, '../exports');
      if (!fs.existsSync(csvDir)) {
        fs.mkdirSync(csvDir, { recursive: true });
      }

      const filename = `guests_export_${Date.now()}.csv`;
      const filepath = path.join(csvDir, filename);
      fs.writeFileSync(filepath, csv);

      await Guest.deleteMany({ _id: { $in: oldGuests.map(g => g._id) } });

      console.log(`Cleaned up ${oldGuests.length} old guests. Exported to ${filename}`);
    } else {
      console.log('No old guests to cleanup');
    }
  } catch (error) {
    console.error('Guest cleanup job error:', error);
  }
});

module.exports = cron;
