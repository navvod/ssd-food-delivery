import { api } from './api';

const paymentService = {
  addCard: async (data) => {
    const response = await api.payment.post('/api/card/add-card', data);
    return response.data;
  },
  getCards: async () => {
    const response = await api.payment.get('/api/card/cards');
    return response.data;
  },
  updateCard: async (cardId, data) => {
    const response = await api.payment.put(`/api/card/update-card/${cardId}`, data);
    return response.data;
  },
  deleteCard: async (cardId) => {
    const response = await api.payment.delete(`/api/card/delete-card/${cardId}`);
    return response.data;
  },
     // Process a payment
  processPayment: async (data) => {
    const response = await api.payment.post('/api/payments/pay', data);
    return response.data;
  },

  // Get payment status for an order
  getPaymentStatus: async (orderId) => {
    const response = await api.payment.get(`/api/payments/${orderId}`);
    return response.data;
  },

  // Refund a payment
  refundPayment: async (orderId) => {
    const response = await api.payment.post(`/api/payments/refund/${orderId}`);
    return response.data;
  },
  
};

export default paymentService;