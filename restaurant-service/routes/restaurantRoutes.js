const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  registerRestaurant,
  updateAvailability,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getRestaurantDetails,
  getRestaurants,
  getRestaurantMenu,
  getMenuItem,
  getRestaurantAddress,
} = require('../controller/restaurantController');

// Public routes (no authentication required)
router.get('/', getRestaurants);
router.get('/:restaurantId/menu', getRestaurantMenu);
router.get('/:restaurantId/address', getRestaurantAddress);

// Admin routes (require authentication and role)
router.post('/register', protect, authorize('restaurant_admin'), upload.single('image'), registerRestaurant);
router.put('/availability', protect, authorize('restaurant_admin'), updateAvailability);
router.post('/menu', protect, authorize('restaurant_admin'), upload.single('image'), addMenuItem);
router.put('/:restaurantId/menu/:itemId', protect, authorize('restaurant_admin'), upload.single('image'), updateMenuItem);
router.delete('/menu/:itemId', protect, authorize('restaurant_admin'), deleteMenuItem);
router.get('/details', protect, authorize('restaurant_admin'), getRestaurantDetails);
router.get('/:restaurantId/menu/:itemId', protect, authorize('restaurant_admin'), getMenuItem);

module.exports = router;