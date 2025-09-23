// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, googleLogin, getProfile } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Register a new user (public route)
router.post('/register', register);

// Login a user (public route)
router.post('/login', login);

// Google OAuth login (public route)
router.post('/google', googleLogin);

// Get user profile (protected route, accessible to all authenticated users)
router.get('/profile', protect, getProfile);

module.exports = router;