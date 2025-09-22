// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { setAuthToken } from '../services/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        setAuthToken(token);
        try {
          const response = await authService.getProfile();
          setUser(response.user);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          setAuthToken(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      setAuthToken(response.token);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await authService.register({ name, email, password, role });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      setAuthToken(response.token);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  const updateProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Profile update failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };