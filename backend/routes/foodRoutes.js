const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const upload = require('../middlewares/upload');
const { uploadSingle } = require('../middlewares/cloudinaryUpload');

router.post('/', upload, uploadSingle('food'), foodController.createFood);
router.get('/', foodController.getAllFoods);
router.get('/:id', foodController.getFoodById);
router.put('/:id', upload, uploadSingle('food'), foodController.updateFood);
router.delete('/:id', foodController.deleteFood);

module.exports = router;
