const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
    ref: 'User', // Reference to User model in User Service
    required: [true, 'User ID is required'],
  },
  mainLocation: {
    type: String,
    required: [true, 'Main location is required'],
    trim: true,
    validate: {
      validator: function (value) {
        // Basic XSS prevention: reject strings with HTML/script tags
        return !/<[a-z][\s\S]*>/i.test(value);
      },
      message: 'Main location cannot contain HTML or script tags',
    },
  },
  vehicleRegNumber: {
    type: String,
    required: [true, 'Vehicle registration number is required'],
    unique: true,
    trim: true, // Ensure consistent uniqueness
    validate: {
      validator: function (value) {
        // Basic XSS prevention: reject strings with HTML/script tags
        return !/<[a-z][\s\S]*>/i.test(value);
      },
      message: 'Vehicle registration number cannot contain HTML or script tags',
    },
  },
  photo: {
    type: String,
    default: null, // Default to null if no photo is uploaded
    trim: true,
    validate: {
      validator: function (value) {
        // Ensure photo is either null or a valid URL, and reject HTML/script tags
        if (!value) return true;
        return !/<[a-z][\s\S]*>/i.test(value) && /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(value);
      },
      message: 'Photo must be a valid URL and cannot contain HTML or script tags',
    },
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^\+?\d{10,15}$/, 'Mobile number must be 10-15 digits, optionally starting with +'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, // Keep existing timestamps option
});

// Indexes for performance
driverSchema.index({ userId: 1 });
driverSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Driver', driverSchema);