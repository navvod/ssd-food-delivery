const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
    ref: 'Order', // Reference to Order model
    required: [true, 'Order ID is required'],
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
    ref: 'Driver', // Reference to Driver model
    required: [true, 'Driver ID is required'],
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
    ref: 'User', // Reference to User model
    required: [true, 'Customer ID is required'],
  },
  restaurantLocation: {
    type: String,
    required: [true, 'Restaurant location is required'],
    trim: true,
    validate: {
      validator: function (value) {
        // Basic XSS prevention: reject strings with HTML/script tags
        return !/<[a-z][\s\S]*>/i.test(value);
      },
      message: 'Restaurant location cannot contain HTML or script tags',
    },
  },
  deliveryLocation: {
    type: String,
    required: [true, 'Delivery location is required'],
    trim: true,
    validate: {
      validator: function (value) {
        // Basic XSS prevention: reject strings with HTML/script tags
        return !/<[a-z][\s\S]*>/i.test(value);
      },
      message: 'Delivery location cannot contain HTML or script tags',
    },
  },
  acceptStatus: {
    type: String,
    enum: {
      values: ['Pending', 'Accepted', 'Declined'],
      message: 'Accept status must be one of: Pending, Accepted, Declined',
    },
    default: 'Pending',
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Assigned', 'Picked Up', 'Delivered', 'Cancelled'],
      message: 'Status must be one of: Pending, Assigned, Picked Up, Delivered, Cancelled',
    },
    default: 'Pending',
  },
}, { 
  timestamps: true // Keep existing timestamps option
});

// Indexes for performance
deliverySchema.index({ orderId: 1 });
deliverySchema.index({ driverId: 1 });
deliverySchema.index({ customerId: 1 });
deliverySchema.index({ status: 1 });

module.exports = mongoose.model('Delivery', deliverySchema);