// src/services/authService.js
import { api } from './api';

const authService = {
  register: async (data) => {
    const response = await api.user.post('/api/auth/register', data);
    return response.data;
  },
  login: async (data) => {
    const response = await api.user.post('/api/auth/login', data);
    return response.data;
  },
  googleLogin: async (data) => {
    const response = await api.user.post('/api/auth/google', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.user.get('/api/auth/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.user.put('/api/auth/profile', data);
    return response.data;
  },
};

export default authService;