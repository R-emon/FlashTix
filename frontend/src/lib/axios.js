// frontend/src/lib/axios.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// We create a custom Axios instance
export const api = axios.create({
  baseURL: '/api/v1',
});

// The Interceptor: Automatically injects your JWT token!
api.interceptors.request.use((config) => {
  // Read the token from our Zustand global state
  const token = useAuthStore.getState().token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
