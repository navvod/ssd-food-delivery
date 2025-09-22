const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    validate: {
      validator: function (value) {
        // Basic XSS prevention: reject strings with HTML/script tags
        return !/<[a-z][\s\S]*>/i.test(value);
      },
      message: 'Name cannot contain HTML or script tags',
    },
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    validate: {
      validator: function (value) {
        // Basic XSS prevention: reject strings with HTML/script tags
        return !/<[a-z][\s\S]*>/i.test(value);
      },
      message: 'Address cannot contain HTML or script tags',
    },
  },
  contact: {
    type: String,
    required: [true, 'Contact is required'],
    trim: true,
    match: [/^\+?\d{10,15}$/, 'Contact must be a phone number with 10-15 digits, optionally starting with +'],
  },
  cuisineType: {
    type: String,
    required: [true, 'Cuisine type is required'],
    trim: true,
    validate: {
      validator: function (value) {
        // Basic XSS prevention: reject strings with HTML/script tags
        return !/<[a-z][\s\S]*>/i.test(value);
      },
      message: 'Cuisine type cannot contain HTML or script tags',
    },
  },
  image: {
    type: String,
    trim: true, // Added trim
    validate: {
      validator: function (value) {
        // Ensure image is either undefined or a valid URL, and reject HTML/script tags
        if (!value) return true;
        return !/<[a-z][\s\S]*>/i.test(value) && /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(value);
      },
      message: 'Image must be a valid URL and cannot contain HTML or script tags',
    },
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
});

// Indexes for performance
restaurantSchema.index({ adminId: 1 });
restaurantSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);