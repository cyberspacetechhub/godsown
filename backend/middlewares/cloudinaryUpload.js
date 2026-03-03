const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');

const uploadToCloudinary = async (file, folder = 'uploads') => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    throw new AppError('Image upload failed', 500);
  }
};

const uploadSingle = (folder) => async (req, res, next) => {
  if (!req.files || !req.files.image) {
    return next();
  }
  
  try {
    const imageUrl = await uploadToCloudinary(req.files.image, folder);
    req.body.imageUrl = imageUrl;
    next();
  } catch (error) {
    next(error);
  }
};

const uploadMultiple = (folder) => async (req, res, next) => {
  if (!req.files || !req.files.images) {
    return next();
  }
  
  try {
    const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
    const imageUrls = await Promise.all(uploadPromises);
    req.body.imageUrls = imageUrls;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadSingle,
  uploadMultiple
};
