const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true, // Index for faster lookups by userId
  },
  stripePaymentMethodId: {
    type: String,
    required: true, // Store the Stripe payment method ID (e.g., pm_xxx)
  },
  last4: {
    type: String, // Last 4 digits of the card (e.g., "4242")
    required: true,
  },
  brand: {
    type: String, // Card brand (e.g., "Visa")
    required: true,
  },
  expiryMonth: {
    type: String, // e.g., "12"
    required: true,
  },
  expiryYear: {
    type: String, // e.g., "2025"
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);