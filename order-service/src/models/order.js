const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    ref: 'MenuItem', // Reference to MenuItem in Restaurant Service
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
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
  }
});

const orderSchema = new mongoose.Schema({
  customerId: {
    type: String,
    ref: 'User', // Reference to User model in User Service
    required: true
  },
  restaurantId: {
    type: String,
    ref: 'Restaurant', // Reference to Restaurant model in Restaurant Service
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['placed', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'canceled','placed'],
    default: 'placed'
  },
  deliveryAddress: {
    type: String,
    required: true,
    trim: true
  },
  fromAddress: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'], 
    match: [/^\d{10}$/, 'Phone number must contain exactly 10 digits'], 
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);