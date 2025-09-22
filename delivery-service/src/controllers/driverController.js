const mongoose = require("mongoose");
const Driver = require("../models/Driver");
const { upload } = require("../config/cloudinaryConfig");
const { body, validationResult } = require("express-validator"); // Added for validation
const rateLimit = require("express-rate-limit"); // Added for rate limiting

// Rate limiter for authenticated endpoints (50 requests per 15 minutes)
const authApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { message: "Too many requests, please try again later" },
});

// Input validation rules
const driverValidation = [
  body("mainLocation").isString().trim().notEmpty().withMessage("Main location is required and must be a string"),
  body("vehicleRegNumber").isString().trim().notEmpty().withMessage("Vehicle registration number is required and must be a string"),
  body("mobileNumber").matches(/^\+?\d{10,15}$/).withMessage("Mobile number must be 10-15 digits"),
];

// Custom middleware to validate file uploads
const validateFileUpload = (req, res, next) => {
  upload.single("photo")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Photo upload failed", error: "Invalid file" });
    }
    if (req.file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Only JPEG and PNG images are allowed" });
      }
      if (req.file.size > maxSize) {
        return res.status(400).json({ message: "Image size exceeds 5MB" });
      }
    }
    next();
  });
};

// Register driver
const registerDriver = [
  authApiLimiter,
  ...driverValidation,
  validateFileUpload,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { mainLocation, vehicleRegNumber, mobileNumber } = req.body;
    const userId = req.user.id;

    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      const existingDriver = await Driver.findOne({ userId });
      if (existingDriver) {
        return res.status(400).json({ message: "Driver already registered" });
      }

      const driver = new Driver({
        userId,
        mainLocation,
        vehicleRegNumber,
        photo: req.file ? req.file.path : null,
        mobileNumber,
        isAvailable: true,
      });

      await driver.save();
      res.status(201).json({ message: "Driver registered successfully", driver });
    } catch (error) {
      console.error("Error registering driver:", error);
      res.status(500).json({ message: "Error registering driver" });
    }
  },
];

// Get driver details
const getMyDetails = [
  authApiLimiter,
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      const driver = await Driver.findOne({ userId: req.user.id });
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      res.status(200).json(driver);
    } catch (error) {
      console.error("Error fetching driver details:", error);
      res.status(500).json({ message: "Error fetching driver details" });
    }
  },
];

// Update driver details
const updateMyDetails = [
  authApiLimiter,
  body("mainLocation").optional().isString().trim().withMessage("Main location must be a string"),
  body("vehicleRegNumber").optional().isString().trim().withMessage("Vehicle registration number must be a string"),
  body("mobileNumber").optional().matches(/^\+?\d{10,15}$/).withMessage("Mobile number must be 10-15 digits"),
  validateFileUpload,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { mainLocation, vehicleRegNumber, mobileNumber } = req.body;

    try {
      if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      const driver = await Driver.findOne({ userId: req.user.id });
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      if (mainLocation) driver.mainLocation = mainLocation;
      if (vehicleRegNumber) driver.vehicleRegNumber = vehicleRegNumber;
      if (mobileNumber) driver.mobileNumber = mobileNumber;
      if (req.file) driver.photo = req.file.path;

      await driver.save();
      res.status(200).json({ message: "Driver details updated", driver });
    } catch (error) {
      console.error("Error updating driver details:", error);
      res.status(500).json({ message: "Error updating driver details" });
    }
  },
];

// Delete driver details
const deleteMyDetails = [
  authApiLimiter,
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      const driver = await Driver.findOneAndDelete({ userId: req.user.id });
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      res.status(200).json({ message: "Driver deleted successfully" });
    } catch (error) {
      console.error("Error deleting driver:", error);
      res.status(500).json({ message: "Error deleting driver" });
    }
  },
];

// Update availability status
const updateAvailabilityStatus = [
  authApiLimiter,
  body("isAvailable").isBoolean().withMessage("isAvailable must be a boolean"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { isAvailable } = req.body;

    try {
      if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      const driver = await Driver.findOne({ userId: req.user.id });
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      driver.isAvailable = isAvailable;
      await driver.save();
      res.status(200).json({ message: "Availability status updated", driver });
    } catch (error) {
      console.error("Error updating availability status:", error);
      res.status(500).json({ message: "Error updating availability status" });
    }
  },
];

module.exports = {
  registerDriver,
  getMyDetails,
  updateMyDetails,
  deleteMyDetails,
  updateAvailabilityStatus,
};