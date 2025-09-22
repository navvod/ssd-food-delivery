const mongoose = require("mongoose");
const Order = require("../models/order");
const Cart = require("../models/cart");
const { body, param, validationResult } = require("express-validator"); // Added for validation
const rateLimit = require("express-rate-limit"); // Added for rate limiting

// Rate limiter for authenticated endpoints (50 requests per 15 minutes)
const authApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: "Too many requests, please try again later" },
});

// Input validation rules
const cartItemValidation = [
  body("restaurantId").isMongoId().withMessage("Invalid restaurant ID format"),
  body("itemId").isMongoId().withMessage("Invalid item ID format"),
  body("itemName").isString().trim().notEmpty().withMessage("Item name is required and must be a string"),
  body("description").optional().isString().trim().withMessage("Description must be a string"),
  body("price").isFloat({ min: 0.01 }).withMessage("Price must be a positive number"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
];

const orderValidation = [
  body("deliveryAddress").isString().trim().notEmpty().withMessage("Delivery address is required"),
  body("fromAddress").isString().trim().notEmpty().withMessage("From address is required"),
  body("phoneNumber").matches(/^\+?\d{10,15}$/).withMessage("Phone number must be 10-15 digits"),
];

// Add items to cart
const addToCart = [
  authApiLimiter,
  ...cartItemValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    const { restaurantId, itemId, itemName, description, price, quantity } = req.body;

    try {
      if (req.user.role !== "customer") {
        return res.status(403).json({ error: "Access denied: Only customers can add to cart" });
      }

      let cart = await Cart.findOne({ customerId: req.user.id });
      if (!cart) {
        cart = new Cart({
          customerId: req.user.id,
          restaurantId,
          items: [{ itemId, itemName, description, price, quantity, amount: price * quantity }],
        });
      } else {
        if (cart.restaurantId && cart.restaurantId.toString() !== restaurantId) {
          return res.status(400).json({
            error: "Cart can only contain items from one restaurant. Please clear your cart to add items from a different restaurant.",
          });
        }

        if (!cart.restaurantId) {
          cart.restaurantId = restaurantId;
        }
        const itemIndex = cart.items.findIndex((item) => item.itemId.toString() === itemId);
        if (itemIndex !== -1) {
          cart.items[itemIndex].quantity += quantity;
          cart.items[itemIndex].amount = cart.items[itemIndex].price * cart.items[itemIndex].quantity;
        } else {
          cart.items.push({ itemId, itemName, description, price, quantity, amount: price * quantity });
        }
      }

      await cart.save();
      const totalAmount = cart.items.reduce((sum, item) => sum + item.amount, 0);
      res.json({ message: "Item added to cart", cart, totalAmount });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ error: "Failed to add to cart" });
    }
  },
];

// Get all cart items
const getCartItems = [
  authApiLimiter,
  async (req, res) => {
    try {
      if (req.user.role !== "customer") {
        return res.status(403).json({ error: "Access denied: Only customers can view cart" });
      }
      const cart = await Cart.findOne({ customerId: req.user.id });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      const totalAmount = cart.items.reduce((sum, item) => sum + item.amount, 0);
      res.json({ cart, totalAmount });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  },
];

// Update cart item quantity
const updateCartItem = [
  authApiLimiter,
  body("itemId").isMongoId().withMessage("Invalid item ID format"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    const { itemId, quantity } = req.body;

    try {
      if (req.user.role !== "customer") {
        return res.status(403).json({ error: "Access denied: Only customers can update cart" });
      }

      const cart = await Cart.findOne({ customerId: req.user.id });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex((item) => item.itemId.toString() === itemId);
      if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found in cart" });
      }

      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].amount = cart.items[itemIndex].price * quantity;
      await cart.save();
      const totalAmount = cart.items.reduce((sum, item) => sum + item.amount, 0);
      res.json({ message: "Cart updated successfully", cart, totalAmount });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ error: "Failed to update cart" });
    }
  },
];

// Delete cart item
const deleteCartItem = [
  authApiLimiter,
  param("itemId").isMongoId().withMessage("Invalid item ID format"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    const { itemId } = req.params;

    try {
      if (req.user.role !== "customer") {
        return res.status(403).json({ error: "Access denied: Only customers can delete cart items" });
      }

      const cart = await Cart.findOne({ customerId: req.user.id });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex((item) => item.itemId.toString() === itemId);
      if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found in cart" });
      }

      cart.items.splice(itemIndex, 1);
      if (cart.items.length === 0) {
        await Cart.deleteOne({ customerId: req.user.id });
        return res.json({ message: "Cart cleared", totalAmount: 0 });
      }

      await cart.save();
      const totalAmount = cart.items.reduce((sum, item) => sum + item.amount, 0);
      res.json({ message: "Item removed from cart", cart, totalAmount });
    } catch (error) {
      console.error("Error deleting cart item:", error);
      res.status(500).json({ error: "Failed to delete cart item" });
    }
  },
];

// Place a new order from cart
const createOrder = [
  authApiLimiter,
  ...orderValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    const { deliveryAddress, fromAddress, phoneNumber } = req.body;

    try {
      const cart = await Cart.findOne({ customerId: req.user.id });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      const totalAmount = cart.items.reduce((sum, item) => sum + item.amount, 0);

      const order = new Order({
        customerId: req.user.id,
        restaurantId: cart.restaurantId,
        items: cart.items.map((item) => ({
          itemId: item.itemId,
          name: item.itemName,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount,
        deliveryAddress,
        fromAddress,
        phoneNumber,
      });

      await order.save();
      await Cart.deleteOne({ customerId: req.user.id });
      res.status(201).json({ message: "Order created successfully", orderId: order._id, order, totalAmount });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  },
];

// Get order by ID (track order)
const getOrder = [
  authApiLimiter,
  param("orderId").isMongoId().withMessage("Invalid order ID format"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) return res.status(404).json({ error: "Order not found" });

      if (req.user.role === "customer" && order.customerId.toString() !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      res.json({ order, totalAmount: order.totalAmount });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  },
];

// Get all orders
const getAllOrders = [
  authApiLimiter,
  async (req, res) => {
    try {
      if (req.user.role !== "restaurant_admin" && req.user.role !== "delivery_personnel") {
        return res.status(403).json({ error: "Access denied: Only restaurant admins and delivery personnel can view all orders" });
      }
      const orders = await Order.find().sort({ createdAt: -1 });
      res.json(orders.map((order) => ({ ...order._doc, totalAmount: order.totalAmount })));
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  },
];

// Modify order (before confirmation, i.e., status = 'placed')
const updateOrder = [
  authApiLimiter,
  param("orderId").isMongoId().withMessage("Invalid order ID format"),
  body("status").isIn(["canceled", "accepted", "preparing", "ready", "out_for_delivery", "delivered"]).withMessage("Invalid status"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    const { status } = req.body;

    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) return res.status(404).json({ error: "Order not found" });

      if (req.user.role === "customer" && order.customerId.toString() !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      if (req.user.role === "customer") {
        if (status !== "canceled") {
          return res.status(403).json({ error: "Customers can only cancel orders" });
        }
        if (order.status !== "placed") {
          return res.status(400).json({ error: "Order can only be canceled before confirmation" });
        }
      } else if (req.user.role === "restaurant_admin") {
        if (!["accepted", "preparing", "ready", "out_for_delivery"].includes(status)) {
          return res.status(400).json({ error: "Invalid status for restaurant admin" });
        }
      } else if (req.user.role === "delivery_personnel") {
        if (status !== "delivered") {
          return res.status(400).json({ error: "Delivery personnel can only set status to delivered" });
        }
      } else {
        return res.status(403).json({ error: "Unauthorized role" });
      }

      order.status = status;
      await order.save();
      res.json({ message: "Order updated successfully", order, totalAmount: order.totalAmount });
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  },
];

// Get order history for customer
const getOrderHistory = [
  authApiLimiter,
  async (req, res) => {
    try {
      if (req.user.role !== "customer") {
        return res.status(403).json({ error: "Access denied: Only customers can view order history" });
      }
      const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
      res.json(orders.map((order) => ({ ...order._doc, totalAmount: order.totalAmount })));
    } catch (error) {
      console.error("Error fetching order history:", error);
      res.status(500).json({ error: "Failed to fetch order history" });
    }
  },
];

// Get active orders for customer
const getActiveOrders = [
  authApiLimiter,
  async (req, res) => {
    try {
      if (req.user.role !== "customer") {
        return res.status(403).json({ error: "Access denied: Only customers can view active orders" });
      }
      const orders = await Order.find({
        customerId: req.user.id,
        status: { $in: ["placed", "accepted", "preparing", "ready", "out_for_delivery"] },
      }).sort({ createdAt: -1 });
      res.json(orders.map((order) => ({ ...order._doc, totalAmount: order.totalAmount })));
    } catch (error) {
      console.error("Error fetching active orders:", error);
      res.status(500).json({ error: "Failed to fetch active orders" });
    }
  },
];

module.exports = {
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  createOrder,
  getOrder,
  getAllOrders,
  updateOrder,
  getOrderHistory,
  getActiveOrders,
};