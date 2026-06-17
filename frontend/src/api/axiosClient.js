import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor: Attach JWT ────
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ── Response Interceptor: Handle Errors ──
axiosClient.interceptors.response.use(
  (response) => {
    // Return the response data directly
    return response.data;
  },
  (error) => {
    const { response } = error;
    if (response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      // Auto redirect to login, preserving target redirect page
      if (!window.location.pathname.includes('/login')) {
        const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?redirect=${redirectPath}`;
      }
    }
    return Promise.reject(response?.data || error);
  }
);

export default axiosClient;
