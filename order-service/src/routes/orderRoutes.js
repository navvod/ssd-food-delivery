const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  createOrder,
  getOrder,
  getAllOrders,
  updateOrder,
  getOrderHistory,
  getActiveOrders
} = require('../controllers/orderController');


// Public route
//router.get('/restaurants', browseRestaurants);

// Protected routes (require authentication)
router.post('/addToCart', protect,addToCart); // Add items to cart
router.get('/getCartItems', protect, getCartItems);
router.put('/cart/update', protect, updateCartItem);
router.delete('/cart/:itemId', protect, deleteCartItem);

router.post('/createOrder',protect, createOrder); // Place order
router.get('/getAllOrders', protect, getAllOrders);
router.get('/getOrder/:orderId',protect, getOrder); // Track order
router.put('/updateOrder/:orderId', protect,updateOrder); // Modify order or update status
router.get('/history',protect, getOrderHistory); // Order history
router.get('/active', protect, getActiveOrders);


module.exports = router;