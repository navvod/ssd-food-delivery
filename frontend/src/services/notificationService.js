import { api } from './api';

const notificationService = {
  // Send an email notification
  sendEmailNotification: async (data) => {
    const response = await api.notification.post('/api/notifications/email', data);
    return response.data;
  },

  // Send an SMS notification
  sendSMSNotification: async (data) => {
    const response = await api.notification.post('/api/notifications/sms', data);
    return response.data;
  },
};

export default notificationService;