const Order = require('../models/order');
const Cart = require('../models/cart');

// Add items to cart
const addToCart = async (req, res) => {
  const { restaurantId, itemId, itemName, description, price, quantity } = req.body;

  console.log('Request body:', req.body); // Debug logging

  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ error: 'Access denied: Only customers can add to cart' });
    }
    if (!restaurantId || !itemId || !itemName || typeof price !== 'number' || typeof quantity !== 'number') {
      return res.status(400).json({ error: 'Missing required fields (restaurantId, itemId, itemName, price, quantity)' });
    }

    let cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart) {
      cart = new Cart({
        customerId: req.user.id,
        restaurantId,
        items: [{ itemId, itemName, description, price, quantity, amount: price * quantity }],
      });
    } else {
      if (cart.restaurantId && cart.restaurantId !== restaurantId) {
        return res.status(400).json({
          error: 'Cart can only contain items from one restaurant. Please clear your cart to add items from a different restaurant.',
        });
      }
      
      if (!cart.restaurantId) {
        cart.restaurantId = restaurantId;
      }
      const itemIndex = cart.items.findIndex((item) => item.itemId === itemId);
      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].amount = cart.items[itemIndex].price * cart.items[itemIndex].quantity;
      } else {
        cart.items.push({ itemId, itemName, description, price, quantity, amount: price * quantity });
      }
    }

    await cart.save();
    const totalAmount = cart.items.reduce((sum, item) => sum + item.amount, 0);
    res.json({ message: 'Item added to cart', cart, totalAmount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart', details: error.message });
  }
};

// Get all cart items
const getCartItems = async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ error: 'Access denied: Only customers can view cart' });
    }
    const cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    const totalAmount = cart.items.reduce((sum, item) => sum + item.amount, 0);
    res.json({ cart, totalAmount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart', details: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  const { itemId, quantity } = req.body;

  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ error: 'Access denied: Only customers can update cart' });
    }
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.itemId === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].amount = cart.items[itemIndex].price * quantity;
    await cart.save();
    const totalAmount = cart.items.reduce((sum, item) => sum + item.amount, 0);
    res.json({ message: 'Cart updated successfully', cart, totalAmount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart', details: error.message });
  }
};

// Delete cart item
const deleteCartItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ error: 'Access denied: Only customers can delete cart items' });
    }

    const cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.itemId === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items.splice(itemIndex, 1);
    if (cart.items.length === 0) {
      await Cart.deleteOne({ customerId: req.user.id });
      return res.json({ message: 'Cart cleared', totalAmount: 0 });
    }

    await cart.save();
    const totalAmount = cart.items.reduce((sum, item) => sum + item.amount, 0);
    res.json({ message: 'Item removed from cart', cart, totalAmount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cart item', details: error.message });
  }
};

// Place a new order from cart
const createOrder = async (req, res) => {
  const { deliveryAddress, fromAddress, phoneNumber } = req.body;

  if (!deliveryAddress || !fromAddress || !phoneNumber) {
    return res.status(400).json({ error: 'Delivery address, from address, and phone number are required' });
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({
      error: 'Invalid phone number. It must contain exactly 10 digits.'
    });
  }

  try {
    const cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.amount, 0);

    const order = new Order({
      customerId: req.user.id,
      restaurantId: cart.restaurantId,
      items: cart.items.map(item => ({
        itemId: item.itemId,
        name: item.itemName,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount,
      deliveryAddress,
      fromAddress,
      phoneNumber
    });

    await order.save();
    await Cart.deleteOne({ customerId: req.user.id });
    res.status(201).json({ message: 'Order created successfully', orderId: order._id, order, totalAmount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
};

// Get order by ID (track order)
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (req.user.role === 'customer' && order.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ order, totalAmount: order.totalAmount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'restaurant_admin' && req.user.role !== 'delivery_personnel') {
      return res.status(403).json({ error: 'Access denied: Only restaurant admins and delivery personnel can view all orders' });
    }
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders.map(order => ({ ...order._doc, totalAmount: order.totalAmount })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
};

// Modify order (before confirmation, i.e., status = 'placed')
const updateOrder = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (req.user.role === 'customer' && order.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (req.user.role === 'customer') {
      if (!['canceled'].includes(status)) {
        return res.status(403).json({ error: 'Customers can only cancel orders' });
      }
      if (order.status !== 'placed') {
        return res.status(400).json({ error: 'Order can only be canceled before confirmation' });
      }
    } else if (req.user.role === 'restaurant_admin') {
      if (!['accepted', 'preparing', 'ready', 'out_for_delivery'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status for restaurant admin' });
      }
    } else if (req.user.role === 'delivery_personnel') {
      if (status !== 'delivered') {
        return res.status(400).json({ error: 'Delivery personnel can only set status to delivered' });
      }
    } else {
      return res.status(403).json({ error: 'Unauthorized role' });
    }

    order.status = status;
    await order.save();
    res.json({ message: 'Order updated successfully', order, totalAmount: order.totalAmount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order', details: error.message });
  }
};

// Get order history for customer
const getOrderHistory = async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ error: 'Access denied: Only customers can view order history' });
    }
    const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders.map(order => ({ ...order._doc, totalAmount: order.totalAmount })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order history', details: error.message });
  }
};

// Get active orders for customer
const getActiveOrders = async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ error: 'Access denied: Only customers can view active orders' });
    }
    const orders = await Order.find({
      customerId: req.user.id,
      status: { $in: ['placed', 'accepted', 'preparing', 'ready', 'out_for_delivery'] },
    }).sort({ createdAt: -1 });
    res.json(orders.map(order => ({ ...order._doc, totalAmount: order.totalAmount })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active orders', details: error.message });
  }
};

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
  getActiveOrders
};