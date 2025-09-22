const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true, // Remove whitespace
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ],
  },
  role: {
    type: String,
    enum: {
      values: ['customer', 'restaurant_admin', 'delivery_personnel'],
      message: 'Role must be one of: customer, restaurant_admin, delivery_personnel',
    },
    default: 'customer',
    trim: true, // Remove whitespace
  },
}, {
  timestamps: true, // Add createdAt and updatedAt fields
});

// Index for role to optimize queries
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);