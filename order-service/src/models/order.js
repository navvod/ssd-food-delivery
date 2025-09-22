const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
    ref: 'MenuItem', // Reference to MenuItem in Restaurant Service
    required: [true, 'Item ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    validate: {
      validator: function (value) {
        // Basic XSS prevention: reject strings with HTML/script tags
        return !/<[a-z][\s\S]*>/i.test(value);
      },
      message: 'Item name cannot contain HTML or script tags',
    },
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
});

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
    ref: 'User', // Reference to User model in User Service
    required: [true, 'Customer ID is required'],
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
    ref: 'Restaurant', // Reference to Restaurant model in Restaurant Service
    required: [true, 'Restaurant ID is required'],
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative'],
  },
  status: {
    type: String,
    enum: {
      values: ['placed', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'canceled'],
      message: 'Status must be one of: placed, accepted, preparing, ready, out_for_delivery, delivered, canceled',
    },
    default: 'placed',
  },
  deliveryAddress: {
    type: String,
    required: [true, 'Delivery address is required'],
    trim: true,
    validate: {
      validator: function (value) {
        // Basic XSS prevention: reject strings with HTML/script tags
        return !/<[a-z][\s\S]*>/i.test(value);
      },
      message: 'Delivery address cannot contain HTML or script tags',
    },
  },
  fromAddress: {
    type: String,
    required: [true, 'From address is required'],
    trim: true,
    validate: {
      validator: function (value) {
        // Basic XSS prevention: reject strings with HTML/script tags
        return !/<[a-z][\s\S]*>/i.test(value);
      },
      message: 'From address cannot contain HTML or script tags',
    },
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?\d{10,15}$/, 'Phone number must be 10-15 digits, optionally starting with +'],
    trim: true,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
});

// Indexes for performance
orderSchema.index({ customerId: 1 });
orderSchema.index({ restaurantId: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);