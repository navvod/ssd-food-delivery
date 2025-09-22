const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    ref: 'MenuItem', // Reference to MenuItem in Restaurant Service
    required: true
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
    default: 0 // Will be calculated in pre-save hook
  }
});

const cartSchema = new mongoose.Schema({
  customerId: {
    type: String,
    ref: 'User', // Reference to User model in User Service
    required: true,
    unique: true // One cart per customer
  },
  restaurantId: {
    type: String,
    ref: 'Restaurant', // Reference to Restaurant model in Restaurant Service
    required: true
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

cartSchema.pre('save', function (next) {
  this.items.forEach(item => {
    item.amount = item.price * item.quantity;
  });
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);