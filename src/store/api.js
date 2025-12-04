import axios from 'axios';
import { refreshSession } from './slices/userSlice';
import { startLoading, stopLoading } from './slices/loadingSlice';

const BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

// Process queued requests after refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor: Add auth token and start loading
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Start loading for API requests
    const store = window.__REDUX_STORE__;
    if (store) {
      store.dispatch(startLoading());
    }
    return config;
  },
  (error) => {
    // Stop loading on request error
    const store = window.__REDUX_STORE__;
    if (store) {
      store.dispatch(stopLoading());
    }
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 and refresh token, stop loading
api.interceptors.response.use(
  (response) => {
    // Stop loading on successful response
    const store = window.__REDUX_STORE__;
    if (store) {
      store.dispatch(stopLoading());
    }
    return response;
  },
  (error) => {
    // Stop loading on error response
    const store = window.__REDUX_STORE__;
    if (store) {
      store.dispatch(stopLoading());
    }
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Get the store dispatch - assuming we can access it
      // This might need adjustment based on how Redux is set up
      const store = window.__REDUX_STORE__; // We'll set this in store.js

      return new Promise((resolve, reject) => {
        store
          .dispatch(refreshSession())
          .unwrap()
          .then((data) => {
            const newToken = data.token;
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
