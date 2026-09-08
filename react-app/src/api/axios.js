import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Attach the Bearer token to every request, if logged in
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Also attach guest cart id for cart routes, if not logged in
  if (!token) {
    let guestId = localStorage.getItem('guest_cart_id');
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem('guest_cart_id', guestId);
    }
    config.headers['X-Guest-Cart-Id'] = guestId;
  }

  return config;
});

// Global 401/403 handling — e.g. suspended account or expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;