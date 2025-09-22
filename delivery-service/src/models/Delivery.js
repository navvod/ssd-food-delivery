const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  driverId: {
    type: String,
  },
  customerId: {
    type: String,
    required: true,
  },
  restaurantLocation: {
    type: String,
    required: true, // e.g., "Downtown", fetched from Restaurant Service
  },
  deliveryLocation: {
    type: String,
    required: true, // e.g., "Suburbs", fetched from customer address
  },
  acceptStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Declined'],
    default: 'Pending', // Tracks if driver has accepted/declined the assignment
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Picked Up', 'Delivered', 'Cancelled'],
    default: 'Pending', // Tracks the delivery progress
  },
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);