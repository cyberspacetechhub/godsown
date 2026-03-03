const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require('../middlewares/upload');
const { uploadSingle } = require('../middlewares/cloudinaryUpload');

router.post('/', upload, uploadSingle('profile'), profileController.createProfile);
router.get('/', profileController.getProfile);
router.put('/:id', upload, uploadSingle('profile'), profileController.updateProfile);
router.delete('/:id', profileController.deleteProfile);

module.exports = router;
