const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const cloudinary = require('../config/cloudinaryConfig');

// Helper function to upload image to Cloudinary
const uploadImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'food-delivery-app' },
      (error, result) => {
        if (error) {
          reject(new Error('Failed to upload image to Cloudinary: ' + error.message));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(file.buffer);
  });
};

// Get all restaurants (public)
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants: ' + error.message });
  }
};

const getRestaurantAddress = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Validate restaurantId
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ error: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(restaurantId).select('address');
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.status(200).json({ address: restaurant.address });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant address: ' + error.message });
  }
};


// Get a restaurant's menu (public)
const getRestaurantMenu = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    const menu = await MenuItem.find({ restaurantId: restaurant._id });
    res.status(200).json({
      restaurant: {
        _id: restaurant._id,
        name: restaurant.name,
        cuisineType: restaurant.cuisineType,
        address: restaurant.address, // Add address
        image: restaurant.image,     // Add image
      },
      menu,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu: ' + error.message });
  }
};

// Get a specific menu item (restaurant admin)
const getMenuItem = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params;

    // Validate restaurantId and itemId
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ error: 'Invalid restaurant ID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: 'Invalid menu item ID format' });
    }

    const restaurant = await Restaurant.findOne({ _id: restaurantId, adminId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const menuItem = await MenuItem.findOne({ _id: itemId, restaurantId });
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item: ' + error.message });
  }
};

// Register a new restaurant (restaurant admin)
const registerRestaurant = async (req, res) => {
  try {
    console.log('User from token:', req.user);
    if (!req.user.id) {
      return res.status(400).json({ error: 'User ID not found in token' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ error: 'Invalid user ID format in token' });
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
    res.status(201).json({ message: 'Restaurant registered successfully', restaurant });
  } catch (error) {
    console.error('Restaurant registration error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Update restaurant availability (restaurant admin)
const updateAvailability = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ adminId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    restaurant.isAvailable = req.body.isAvailable;
    await restaurant.save();
    res.json({ message: 'Availability updated', restaurant });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addMenuItem = async (req, res) => {
  try {
    console.log('Adding menu item with data:', req.body);
    console.log('Authenticated user:', req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ error: 'Invalid user ID format in token' });
    }

    const restaurant = await Restaurant.findOne({ adminId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const { name, price: priceString, category } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required and must be a string' });
    }

    const price = parseFloat(priceString); // Parse price from string to number
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Price is required and must be a positive number' });
    }

    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: 'Category is required and must be a string' });
    }

    let imageUrl;
    if (req.file) {
      imageUrl = await uploadImageToCloudinary(req.file);
    }

    const menuItem = new MenuItem({
      restaurantId: restaurant._id,
      name: req.body.name,
      description: req.body.description,
      price: price,
      category: req.body.category,
      image: imageUrl,
    });
    await menuItem.save();
    res.status(201).json({ message: 'Menu item added', menuItem });
  } catch (error) {
    console.error('Error in addMenuItem:', error.message, error.stack);
    res.status(400).json({ error: error.message });
  }
};
// Update a menu item (restaurant admin)
const updateMenuItem = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ error: 'Invalid restaurant ID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: 'Invalid menu item ID format' });
    }

    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    if (menuItem.restaurantId.toString() !== restaurantId) {
      return res.status(403).json({ error: 'Menu item does not belong to the specified restaurant' });
    }

    const restaurant = await Restaurant.findOne({ _id: restaurantId, adminId: req.user.id });
    if (!restaurant) {
      return res.status(403).json({ error: 'Restaurant not found or not authorized' });
    }

    let imageUrl = menuItem.image;
    if (req.file) {
      imageUrl = await uploadImageToCloudinary(req.file);
    }

    const allowedUpdates = ['name', 'description', 'price', 'category', 'image'];
    const updateData = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        if (key === 'price') {
          const price = parseFloat(req.body.price);
          if (isNaN(price)) {
            return res.status(400).json({ error: 'Price must be a valid number' });
          }
          updateData.price = price;
        } else if (key === 'image') {
          updateData[key] = imageUrl;
        } else {
          updateData[key] = req.body[key];
        }
      }
    }

    Object.assign(menuItem, updateData);
    await menuItem.save();

    const updatedMenuItem = await MenuItem.findById(itemId);
    res.json({ message: 'Menu item updated', menuItem: updatedMenuItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Delete a menu item (restaurant admin)
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.itemId);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const restaurant = await Restaurant.findOne({ adminId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (menuItem.restaurantId.toString() !== restaurant._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    await menuItem.deleteOne();
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get restaurant details and menu (restaurant admin)
const getRestaurantDetails = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ adminId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const menu = await MenuItem.find({ restaurantId: restaurant._id });
    res.json({ restaurant, menu });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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