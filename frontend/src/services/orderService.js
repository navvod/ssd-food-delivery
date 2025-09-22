import { api } from './api';

const orderService = {
  getCartItems: async () => {
    const response = await api.order.get('/api/orders/getCartItems');
    return response.data;
  },

  addToCart: async (item) => {
    const response = await api.order.post('/api/orders/addToCart', item);
    return response.data;
  },

  updateCartItem: async ({ itemId, quantity }) => {
    const response = await api.order.put('/api/orders/cart/update', { itemId, quantity });
    return response.data;
  },

  deleteCartItem: async (itemId) => {
    const response = await api.order.delete(`/api/orders/cart/${itemId}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await api.order.post('/api/orders/createOrder', orderData);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.order.get('/api/orders/getAllOrders');
    return response.data;
  },

  getOrder: async (orderId) => {
    const response = await api.order.get(`/api/orders/getOrder/${orderId}`);
    return response.data;
  },

  updateOrder: async (orderId, status) => {
    const response = await api.order.put(`/api/orders/updateOrder/${orderId}`, { status });
    return response.data;
  },

  getOrderHistory: async () => {
    const response = await api.order.get('/api/orders/history');
    return response.data;
  },

  getActiveOrders: async () => {
    const response = await api.order.get('/api/orders/active');
    return response.data;
  },
};

export default orderService;