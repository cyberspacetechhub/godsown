const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const verifyJwt = require('../middlewares/verifyJwt');
const verifyRoles = require('../middlewares/verifyRoles');
const seedSettings = require('../utils/seedSettings');

router.get('/debug', async (req, res) => {
  try {
    const Settings = require('../models/Settings');
    const count = await Settings.countDocuments();
    const settings = await Settings.find().limit(5);
    res.json({ 
      success: true, 
      count, 
      sample: settings,
      message: `Found ${count} settings in database` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get('/public', settingsController.getPublicSettings);
router.post('/seed', async (req, res) => {
  try {
    await seedSettings();
    res.json({ success: true, message: 'Settings seeded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get('/category/:category', verifyJwt, verifyRoles('admin'), settingsController.getSettingsByCategory);
router.get('/', settingsController.getAllSettings);
router.put('/', verifyJwt, verifyRoles('admin'), settingsController.updateSettings);

module.exports = router;