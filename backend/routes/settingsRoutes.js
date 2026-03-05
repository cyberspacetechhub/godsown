const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const verifyJwt = require('../middlewares/verifyJwt');
const verifyRoles = require('../middlewares/verifyRoles');
const seedSettings = require('../utils/seedSettings');

router.get('/public', settingsController.getPublicSettings);
router.get('/wifi', settingsController.getWifiSettings);
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