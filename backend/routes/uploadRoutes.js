const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { uploadToCloudinary } = require('../middlewares/cloudinaryUpload');
const asyncHandler = require('../utils/asyncHandler');

router.post('/single', upload, asyncHandler(async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  const url = await uploadToCloudinary(req.files.file, req.body.folder || 'uploads');
  res.status(200).json({ success: true, url });
}));

router.post('/multiple', upload, asyncHandler(async (req, res) => {
  if (!req.files || !req.files.files) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  
  const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
  const uploadPromises = files.map(file => uploadToCloudinary(file, req.body.folder || 'uploads'));
  const urls = await Promise.all(uploadPromises);
  
  res.status(200).json({ success: true, urls });
}));

module.exports = router;
