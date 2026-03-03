const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const upload = require('../middlewares/upload');
const { uploadSingle } = require('../middlewares/cloudinaryUpload');

router.post('/', upload, uploadSingle('property'), propertyController.createProperty);
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);
router.put('/:id', upload, uploadSingle('property'), propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

module.exports = router;
