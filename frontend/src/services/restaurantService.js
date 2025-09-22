import { api } from './api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const restaurantService = {
  getRestaurants: async () => {
    try {
      const response = await api.restaurant.get('/api/restaurants');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getRestaurantAddress: async (restaurantId) => {
    try {
      const response = await api.restaurant.get(`/api/restaurants/${restaurantId}/address`);
      return response.data.address;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch restaurant address' };
    }
  },
  getRestaurantMenu: async (restaurantId) => {
    try {
      const response = await api.restaurant.get(`/api/restaurants/${restaurantId}/menu`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getMenuItem: async (restaurantId, itemId) => {
    try {
      const response = await api.restaurant.get(`/api/restaurants/${restaurantId}/menu/${itemId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch menu item' };
    }
  },
  registerRestaurant: async (data) => {
    try {
      const response = await api.restaurant.post('/api/restaurants/register', data, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to register restaurant' };
    }
  },
  updateAvailability: async (isAvailable) => {
    try {
      const response = await api.restaurant.put('/api/restaurants/availability', { isAvailable }, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update availability' };
    }
  },
  addMenuItem: async (restaurantId, data) => {
    try {
      const response = await api.restaurant.post('/api/restaurants/menu', data, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add menu item' };
    }
  },
  updateMenuItem: async (restaurantId, itemId, updatedItem) => {
    try {
      const response = await api.restaurant.put(`/api/restaurants/${restaurantId}/menu/${itemId}`, updatedItem, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update menu item' };
    }
  },
  deleteMenuItem: async (itemId) => {
    try {
      const response = await api.restaurant.delete(`/api/restaurants/menu/${itemId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete menu item' };
    }
  },
  getRestaurantDetails: async () => {
    try {
      const response = await api.restaurant.get('/api/restaurants/details', {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch restaurant details' };
    }
  },
};

export default restaurantService;