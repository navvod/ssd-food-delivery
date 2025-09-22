import { api } from './api';

const deliveryService = {
  // Driver Management Endpoints
  registerDriver: async (formData) => {
    const response = await api.delivery.post('/api/driver/register-driver', formData);
    return response.data;
  },

  getDriverDetails: async () => {
    const response = await api.delivery.get('/api/driver/my-details');
    return response.data;
  },

  updateDriverDetails: async (data) => {
    const response = await api.delivery.put('/api/driver/my-details', data);
    return response.data;
  },

  deleteDriverDetails: async () => {
    const response = await api.delivery.delete('/api/driver/my-details');
    return response.data;
  },

  updateAvailabilityStatus: async (isAvailable) => {
    const response = await api.delivery.put('/api/driver/availability', { isAvailable });
    return response.data;
  },

  // Delivery Order Endpoints
  assignDriver: async (data) => {
    const response = await api.delivery.post('/api/delivery/assign', data);
    return response.data;
  },

  respondToAssignment: async (orderId, action) => {
    const response = await api.delivery.post('/api/delivery/respond', { orderId, action });
    return response.data;
  },

  getAssignedOrders: async () => {
    const response = await api.delivery.get('/api/delivery/assigned-orders');
    return response.data;
  },
  updateDeliveryStatus: async (orderId, status) => {
    const response = await api.delivery.post('/api/delivery/update-status', { orderId, status });
    return response.data;
  },
};

export default deliveryService;