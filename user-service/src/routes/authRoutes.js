const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Register a new user (public route)
router.post('/register', register);

// Login a user (public route)
router.post('/login', login);

// Get user profile (protected route, accessible to all authenticated users)
router.get('/profile', protect, getProfile);



// // Example: Route accessible only to restaurant_admin
// router.get('/admin-dashboard', protect, authorize('restaurant_admin'), (req, res) => {
//   res.json({ message: 'Welcome to the Admin Dashboard' });
// });

// // Example: Route accessible to both customer and delivery_personnel
// router.get('/order-status', protect, authorize('customer', 'delivery_personnel'), (req, res) => {
//   res.json({ message: 'Order status available' });
//});

module.exports = router;