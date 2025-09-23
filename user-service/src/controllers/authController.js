// src/controllers/authController.js
const User = require("../models/User");
const { hashPassword, comparePassword, generateToken } = require("../config/auth");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Rate limiter for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many login attempts, please try again after 15 minutes",
  },
});

// Rate limiter for Google login endpoint
const googleLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many Google login attempts, please try again after 15 minutes",
  },
});

// Password validation rules
const passwordValidation = body("password")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
  .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
  .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
  .matches(/[0-9]/).withMessage("Password must contain at least one number")
  .matches(/[!@#$%^&*]/).withMessage("Password must contain at least one special character");

// Register a new user
const register = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  passwordValidation,
  body("role").isIn(["customer", "restaurant_admin", "delivery_personnel"]).withMessage("Invalid role"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { email, password, role } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = new User({ email, password: hashedPassword, role });
      await user.save();

      const token = generateToken(user);
      res.status(201).json({ message: "User registered successfully", token, user: { email, role } });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
];

// Login a user
const login = [
  loginLimiter,
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  passwordValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(403).json({ message: "Account is locked, try again later" });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        if (user.failedLoginAttempts >= 5) {
          user.lockUntil = Date.now() + 15 * 60 * 1000;
        }
        await user.save();
        return res.status(400).json({ message: "Invalid credentials" });
      }

      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();

      const token = generateToken(user);
      res.json({ message: "Login successful", token, user: { email: user.email, role: user.role } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
];

// Google OAuth login
const googleLogin = [
  googleLoginLimiter,
  body("token").notEmpty().withMessage("Google token is required"),
  body("role").isIn(["customer", "restaurant_admin", "delivery_personnel"]).withMessage("Invalid role"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { token, role } = req.body;

    try {
      // Verify Google ID token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { email, sub: googleId, name } = ticket.getPayload();

      // Find or create user
      let user = await User.findOne({ email });
      if (user) {
        // Existing user: verify role matches
        if (user.role !== role) {
          return res.status(400).json({ message: "Role mismatch for existing user" });
        }
        // Update googleId if not set
        if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }
      } else {
        // New user: create with provided role
        user = new User({
          email,
          name,
          password: null,
          googleId,
          role,
        });
        await user.save();
      }

      // Generate JWT
      const jwtToken = generateToken(user);
      res.json({ message: "Google login successful", token: jwtToken, user: { email: user.email, role: user.role } });
    } catch (error) {
      console.error("Google login error:", error);
      res.status(401).json({ message: "Invalid Google token" });
    }
  },
];

// Get user profile
const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error("Invalid user data in token:", req.user);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    console.log("Fetching profile for user ID:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.warn("User not found for ID:", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile retrieved successfully", user });
  } catch (error) {
    console.error("Profile retrieval error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, googleLogin, getProfile };