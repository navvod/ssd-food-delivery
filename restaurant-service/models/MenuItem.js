const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId, // Links to Restaurant
    ref: 'Restaurant', // Added ref for clarity
    required: [true, 'Restaurant ID is required'],
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
  description: {
    type: String,
    trim: true,
    validate: {
      validator: function (value) {
        // Basic XSS prevention: reject strings with HTML/script tags
        return !value || !/<[a-z][\s\S]*>/i.test(value);
      },
      message: 'Description cannot contain HTML or script tags',
    },
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    validate: {
      validator: function (value) {
        // Basic XSS prevention: reject strings with HTML/script tags
        return !/<[a-z][\s\S]*>/i.test(value);
      },
      message: 'Category cannot contain HTML or script tags',
    },
  },
  image: {
    type: String, // URL to image stored externally (e.g., AWS S3)
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
    default: true,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
});

// Indexes for performance
menuItemSchema.index({ restaurantId: 1 });
menuItemSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);