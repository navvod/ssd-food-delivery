const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure CloudinaryStorage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'drivers', // Store photos in a 'drivers' folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Restrict to image formats
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };