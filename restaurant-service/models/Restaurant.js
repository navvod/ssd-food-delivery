const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  cuisineType: {
    type: String,
    required: true,
  },

  image: { 
    type: String 
  },
   
  isAvailable: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Restaurant', restaurantSchema);