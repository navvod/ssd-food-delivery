const User = require("../models/User");
const { hashPassword, comparePassword, generateToken } = require("../config/auth");
const { body, validationResult } = require("express-validator"); // Added for input validation
const rateLimit = require("express-rate-limit"); // Added for rate limiting

// Rate limiter for login endpoint (limit to 5 attempts per IP per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per IP
  message: {
    message: "Too many login attempts, please try again after 15 minutes",
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
  // Input validation
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  passwordValidation,
  body("role").isIn(["customer", "restaurant_admin", "delivery_personnel"]).withMessage("Invalid role"),
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { email, password, role } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = new User({ email, password: hashedPassword, role });
      await user.save();

      // Generate and return JWT token
      const token = generateToken(user, { expiresIn: "1h" }); // Set token expiration
      res.status(201).json({ message: "User registered successfully", token, user: { email, role } });
    } catch (error) {
      console.error("Registration error:", error); // Log error securely
      res.status(500).json({ message: "Server error" }); // Generic error message
    }
  },
];

// Login a user
const login = [
  // Apply rate limiter and input validation
  loginLimiter,
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  passwordValidation,
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check for account lockout
      if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(403).json({ message: "Account is locked, try again later" });
      }

      // Compare passwords
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        // Increment failed login attempts
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        if (user.failedLoginAttempts >= 5) {
          user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
        }
        await user.save();
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Reset failed login attempts on successful login
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();

      // Generate and return JWT token
      const token = generateToken(user, { expiresIn: "1h" }); // Set token expiration
      res.json({ message: "Login successful", token, user: { email: user.email, role: user.role } });
    } catch (error) {
      console.error("Login error:", error); // Log error securely
      res.status(500).json({ message: "Server error" }); // Generic error message
    }
  },
];

// Get user profile
const getProfile = async (req, res) => {
  try {
    // Validate req.user from middleware
    if (!req.user || !req.user.id) {
      console.error("Invalid user data in token:", req.user);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    console.log("Fetching profile for user ID:", req.user.id); // Debug log

    // Fetch user from database, excluding password
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.warn("User not found for ID:", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile retrieved successfully", user });
  } catch (error) {
    console.error("Profile retrieval error:", error); // Log error securely
    res.status(500).json({ message: "Server error" }); // Generic error message
  }
};

module.exports = { register, login, getProfile };