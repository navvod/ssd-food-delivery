const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const cloudinary = require("../config/cloudinaryConfig");
const { body, param, validationResult } = require("express-validator"); // Added for input validation
const rateLimit = require("express-rate-limit"); // Added for rate limiting

// Rate limiter for public endpoints (e.g., 100 requests per IP per 15 minutes)
const publicApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests, please try again later" },
});

// Rate limiter for authenticated endpoints (e.g., 50 requests per IP per 15 minutes)
const authApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: "Too many requests, please try again later" },
});

// Helper function to upload image to Cloudinary with validation
const uploadImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.mimetype)) {
      return reject(new Error("Only JPEG and PNG images are allowed"));
    }
    if (file.size > maxSize) {
      return reject(new Error("Image size exceeds 5MB"));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "food-delivery-app",
        public_id: `restaurant_${Date.now()}_${Math.random().toString(36).substring(2)}`, // Unique ID
        overwrite: false, // Prevent overwriting existing images
      },
      (error, result) => {
        if (error) {
          reject(new Error("Failed to upload image to Cloudinary"));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(file.buffer);
  });
};

// Input validation rules
const restaurantValidation = [
  body("name").isString().trim().notEmpty().withMessage("Name is required and must be a string"),
  body("address").isString().trim().notEmpty().withMessage("Address is required and must be a string"),
  body("contact").isString().trim().notEmpty().withMessage("Contact is required and must be a string"),
  body("cuisineType").isString().trim().notEmpty().withMessage("Cuisine type is required and must be a string"),
];

const menuItemValidation = [
  body("name").isString().trim().notEmpty().withMessage("Name is required and must be a string"),
  body("price").isFloat({ min: 0.01 }).withMessage("Price must be a positive number"),
  body("category").isString().trim().notEmpty().withMessage("Category is required and must be a string"),
  body("description").optional().isString().trim().withMessage("Description must be a string"),
];

// Get all restaurants (public)
const getRestaurants = [
  publicApiLimiter,
  async (req, res) => {
    try {
      const restaurants = await Restaurant.find().select("name cuisineType image isAvailable"); // Limit fields
      res.status(200).json(restaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  },
];

// Get a restaurant's address (public)
const getRestaurantAddress = [
  publicApiLimiter,
  param("restaurantId").isMongoId().withMessage("Invalid restaurant ID format"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    try {
      const { restaurantId } = req.params;
      const restaurant = await Restaurant.findById(restaurantId).select("address");
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      res.status(200).json({ address: restaurant.address });
    } catch (error) {
      console.error("Error fetching restaurant address:", error);
      res.status(500).json({ error: "Failed to fetch restaurant address" });
    }
  },
];

// Get a restaurant's menu (public)
const getRestaurantMenu = [
  publicApiLimiter,
  param("restaurantId").isMongoId().withMessage("Invalid restaurant ID format"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    try {
      const restaurant = await Restaurant.findById(req.params.restaurantId).select(
        "name cuisineType address image isAvailable"
      );
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      const menu = await MenuItem.find({ restaurantId: restaurant._id }).select(
        "name price category image"
      ); // Limit fields
      res.status(200).json({
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          cuisineType: restaurant.cuisineType,
          address: restaurant.address,
          image: restaurant.image,
          isAvailable: restaurant.isAvailable,
        },
        menu,
      });
    } catch (error) {
      console.error("Error fetching menu:", error);
      res.status(500).json({ error: "Failed to fetch menu" });
    }
  },
];

// Get a specific menu item (restaurant admin)
const getMenuItem = [
  authApiLimiter,
  param("restaurantId").isMongoId().withMessage("Invalid restaurant ID format"),
  param("itemId").isMongoId().withMessage("Invalid menu item ID format"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    try {
      const { restaurantId, itemId } = req.params;
      const restaurant = await Restaurant.findOne({ _id: restaurantId, adminId: req.user.id });
      if (!restaurant) {
        return res.status(403).json({ error: "Restaurant not found or not authorized" });
      }

      const menuItem = await MenuItem.findOne({ _id: itemId, restaurantId });
      if (!menuItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }

      res.status(200).json(menuItem);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      res.status(500).json({ error: "Failed to fetch menu item" });
    }
  },
];

// Register a new restaurant (restaurant admin)
const registerRestaurant = [
  authApiLimiter,
  ...restaurantValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
        return res.status(400).json({ error: "Invalid user ID format in token" });
      }

      let imageUrl;
      if (req.file) {
        imageUrl = await uploadImageToCloudinary(req.file);
      }

      const restaurant = new Restaurant({
        adminId: req.user.id,
        name: req.body.name,
        address: req.body.address,
        contact: req.body.contact,
        cuisineType: req.body.cuisineType,
        image: imageUrl,
      });
      await restaurant.save();
      res.status(201).json({ message: "Restaurant registered successfully", restaurant });
    } catch (error) {
      console.error("Restaurant registration error:", error);
      res.status(500).json({ error: "Failed to register restaurant" });
    }
  },
];

// Update restaurant availability (restaurant admin)
const updateAvailability = [
  authApiLimiter,
  body("isAvailable").isBoolean().withMessage("isAvailable must be a boolean"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    try {
      const restaurant = await Restaurant.findOne({ adminId: req.user.id });
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      restaurant.isAvailable = req.body.isAvailable;
      await restaurant.save();
      res.json({ message: "Availability updated", restaurant });
    } catch (error) {
      console.error("Error updating availability:", error);
      res.status(500).json({ error: "Failed to update availability" });
    }
  },
];

// Add a menu item (restaurant admin)
const addMenuItem = [
  authApiLimiter,
  ...menuItemValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
        return res.status(400).json({ error: "Invalid user ID format in token" });
      }

      const restaurant = await Restaurant.findOne({ adminId: req.user.id });
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      let imageUrl;
      if (req.file) {
        imageUrl = await uploadImageToCloudinary(req.file);
      }

      const menuItem = new MenuItem({
        restaurantId: restaurant._id,
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        category: req.body.category,
        image: imageUrl,
      });
      await menuItem.save();
      res.status(201).json({ message: "Menu item added", menuItem });
    } catch (error) {
      console.error("Error adding menu item:", error);
      res.status(500).json({ error: "Failed to add menu item" });
    }
  },
];

// Update a menu item (restaurant admin)
const updateMenuItem = [
  authApiLimiter,
  param("restaurantId").isMongoId().withMessage("Invalid restaurant ID format"),
  param("itemId").isMongoId().withMessage("Invalid menu item ID format"),
  ...menuItemValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    try {
      const { restaurantId, itemId } = req.params;
      const menuItem = await MenuItem.findById(itemId);
      if (!menuItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }

      if (menuItem.restaurantId.toString() !== restaurantId) {
        return res.status(403).json({ error: "Menu item does not belong to the specified restaurant" });
      }

      const restaurant = await Restaurant.findOne({ _id: restaurantId, adminId: req.user.id });
      if (!restaurant) {
        return res.status(403).json({ error: "Restaurant not found or not authorized" });
      }

      let imageUrl = menuItem.image;
      if (req.file) {
        imageUrl = await uploadImageToCloudinary(req.file);
      }

      const allowedUpdates = ["name", "description", "price", "category", "image"];
      const updateData = {};
      for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
          updateData[key] = key === "image" ? imageUrl : req.body[key];
        }
      }

      Object.assign(menuItem, updateData);
      await menuItem.save();
      res.json({ message: "Menu item updated", menuItem });
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(500).json({ error: "Failed to update menu item" });
    }
  },
];

// Delete a menu item (restaurant admin)
const deleteMenuItem = [
  authApiLimiter,
  param("itemId").isMongoId().withMessage("Invalid menu item ID format"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    try {
      const menuItem = await MenuItem.findById(req.params.itemId);
      if (!menuItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }

      const restaurant = await Restaurant.findOne({ adminId: req.user.id });
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      if (menuItem.restaurantId.toString() !== restaurant._id.toString()) {
        return res.status(403).json({ error: "Not authorized to delete this item" });
      }

      await menuItem.deleteOne();
      res.json({ message: "Menu item deleted" });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  },
];

// Get restaurant details and menu (restaurant admin)
const getRestaurantDetails = [
  authApiLimiter,
  async (req, res) => {
    try {
      const restaurant = await Restaurant.findOne({ adminId: req.user.id });
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      const menu = await MenuItem.find({ restaurantId: restaurant._id });
      res.json({ restaurant, menu });
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      res.status(500).json({ error: "Failed to fetch restaurant details" });
    }
  },
];

module.exports = {
  getRestaurants,
  getRestaurantAddress,
  getRestaurantMenu,
  getMenuItem,
  registerRestaurant,
  updateAvailability,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getRestaurantDetails,
};