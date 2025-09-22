const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
    ref: 'MenuItem', // Reference to MenuItem in Restaurant Service
    required: [true, 'Item ID is required'],
  },
  itemName: {
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
  description: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function (value) {
        // Basic XSS prevention: reject strings with HTML/script tags
        return !/<[a-z][\s\S]*>/i.test(value);
      },
      message: 'Description cannot contain HTML or script tags',
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
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
    // Removed default: 0 as it's calculated in pre-save hook
  },
});

const cartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
    ref: 'User', // Reference to User model in User Service
    required: [true, 'Customer ID is required'],
    unique: true, // One cart per customer
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
    ref: 'Restaurant', // Reference to Restaurant model in Restaurant Service
    required: [true, 'Restaurant ID is required'],
  },
  items: [cartItemSchema],
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
});

// Pre-save hook to calculate amount and validate inputs
cartSchema.pre('save', function (next) {
  this.items.forEach(item => {
    if (typeof item.price !== 'number' || item.price < 0 || typeof item.quantity !== 'number' || item.quantity < 1) {
      return next(new Error('Invalid price or quantity in cart item'));
    }
    item.amount = item.price * item.quantity;
  });
  next();
});

// Indexes for performance
cartSchema.index({ customerId: 1 });
cartSchema.index({ restaurantId: 1 });

module.exports = mongoose.model('Cart', cartSchema);