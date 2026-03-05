import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

// Process queue after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        // No refresh token, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        
        // Store new tokens
        localStorage.setItem('access_token', access);
        
        // Process queued requests
        processQueue(null, access);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Hotel/Accommodation Search API
export const searchHotels = async (params) => {
  const { location, check_in, check_out, guests = 1, latitude, longitude } = params;
  
  // Build query params
  const queryParams = new URLSearchParams();
  if (location) queryParams.append('location', location);
  if (check_in) queryParams.append('check_in', check_in);
  if (check_out) queryParams.append('check_out', check_out);
  if (guests) queryParams.append('guests', guests.toString());
  if (latitude) queryParams.append('latitude', latitude.toString());
  if (longitude) queryParams.append('longitude', longitude.toString());

  const response = await api.get(`/hotels/search/?${queryParams.toString()}`);
  return response.data;
};

// Get nearby airports based on GPS coordinates
export const getNearbyAirports = async (latitude, longitude, limit = 5, maxDistance = 500) => {
  const queryParams = new URLSearchParams();
  queryParams.append('latitude', latitude.toString());
  queryParams.append('longitude', longitude.toString());
  queryParams.append('limit', limit.toString());
  queryParams.append('max_distance', maxDistance.toString());

  const response = await api.get(`/airports/nearby/?${queryParams.toString()}`);
  return response.data;
};

// Get nearest airport based on GPS coordinates
export const getNearestAirport = async (latitude, longitude) => {
  const queryParams = new URLSearchParams();
  queryParams.append('latitude', latitude.toString());
  queryParams.append('longitude', longitude.toString());

  const response = await api.get(`/airports/nearest/?${queryParams.toString()}`);
  return response.data;
};

export default api;
