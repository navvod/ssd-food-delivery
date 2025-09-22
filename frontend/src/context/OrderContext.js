import { createContext, useState, useCallback } from 'react';
import orderService from '../services/orderService';
import { toast } from 'react-toastify';

const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    try {
      const response = await orderService.createOrder(orderData);
      toast.success('Order placed successfully!');
      return response;
    } catch (error) {
      console.error('Create order error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching all orders from API...');
      const response = await orderService.getAllOrders();
      console.log('Get all orders response:', response);
      // Ensure response is an array; adjust based on actual API response structure
      const fetchedOrders = Array.isArray(response) ? response : response.orders || [];
      setOrders(fetchedOrders);
      console.log('Orders set in state:', fetchedOrders);
      return fetchedOrders;
    } catch (error) {
      console.error('Get all orders error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to fetch orders');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrder = useCallback(async (orderId) => {
    setLoading(true);
    try {
      const response = await orderService.getOrder(orderId);
      return response.order;
    } catch (error) {
      console.error('Get order error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrder = useCallback(async (orderId, status) => {
    setLoading(true);
    try {
      const response = await orderService.updateOrder(orderId, status);
      toast.success('Order updated successfully!');
      return response;
    } catch (error) {
      console.error('Update order error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to update order');
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderHistory = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching order history from API...');
      const response = await orderService.getOrderHistory();
      console.log('Order history response:', response);
      // The backend returns the orders array directly, not wrapped in an "orders" property
      setOrderHistory(response || []);
      return response;
    } catch (error) {
      console.error('Get order history error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to fetch order history');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getActiveOrders = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching active orders from API...');
      const response = await orderService.getActiveOrders();
      console.log('Active orders response:', response);
      // The backend returns the orders array directly, not wrapped in an "orders" property
      setActiveOrders(response || []);
      return response;
    } catch (error) {
      console.error('Get active orders error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to fetch active orders');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrders,
        orderHistory,
        loading,
        createOrder,
        getAllOrders,
        getOrder,
        updateOrder,
        getOrderHistory,
        getActiveOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext, OrderProvider };