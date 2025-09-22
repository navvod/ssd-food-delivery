import { createContext, useState, useCallback } from 'react';
import orderService from '../services/orderService';
import { toast } from 'react-toastify';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    console.log('fetchCart called, setting loading to true');
    setLoading(true);
    try {
      const response = await orderService.getCartItems();
      console.log('fetchCart response:', response);
      const cartData = response.cart ? { ...response.cart, totalAmount: response.totalAmount || response.cart.totalAmount } : null;
      setCart(cartData);
    } catch (error) {
      console.log('fetchCart error:', error.response?.data?.error || error.message);
      if (error.response?.status === 404 && error.response?.data?.error === 'Cart not found') {
        setCart(null);
      } else {
        toast.error(error.response?.data?.error || 'Failed to fetch cart');
      }
    } finally {
      console.log('fetchCart finished, setting loading to false');
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (item) => {
    setLoading(true);
    try {
      const response = await orderService.addToCart(item);
      const cartData = response.cart ? { ...response.cart, totalAmount: response.totalAmount || response.cart.totalAmount } : null;
      setCart(cartData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartItem = useCallback(async ({ itemId, quantity }) => {
    setLoading(true);
    try {
      const response = await orderService.updateCartItem({ itemId, quantity });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCartItem = useCallback(async (itemId) => {
    setLoading(true);
    try {
      const response = await orderService.deleteCartItem(itemId);
      const cartData = response.cart ? { ...response.cart, totalAmount: response.totalAmount || response.cart.totalAmount } : null;
      setCart(cartData || null);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderService.clearCart();
      setCart(null);
      toast.success('Cart cleared successfully!');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, updateCartItem, deleteCartItem, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };