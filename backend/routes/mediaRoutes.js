const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

router.post('/', mediaController.createMedia);
router.get('/', mediaController.getAllMedia);
router.get('/:id', mediaController.getMediaById);
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;
