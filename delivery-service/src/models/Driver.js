const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  mainLocation: {
    type: String,
    required: true,
  },
  vehicleRegNumber: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String, // Optional: URL to the driver's uploaded photo (Cloudinary URL)
    default: null, // Default to null if no photo is uploaded
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);