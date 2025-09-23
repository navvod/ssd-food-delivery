// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [false, 'Password is not required for OAuth users'], // Made optional
    minlength: [8, 'Password must be at least 8 characters long'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ],
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values without uniqueness conflicts
  },
  role: {
    type: String,
    enum: {
      values: ['customer', 'restaurant_admin', 'delivery_personnel'],
      message: 'Role must be one of: customer, restaurant_admin, delivery_personnel',
    },
    required: [true, 'Role is required'],
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for role and googleId
userSchema.index({ role: 1 });
userSchema.index({ googleId: 1 });

module.exports = mongoose.model('User', userSchema);