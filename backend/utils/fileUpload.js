const cloudinary = require('../config/cloudinary');
const AppError = require('./AppError');

const uploadToCloudinary = async (file, folder = 'shipments') => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: `shipment-app/${folder}`,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    throw new AppError('File upload failed', 500);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};
