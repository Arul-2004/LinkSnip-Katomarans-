import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration/unauthorized errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 response and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call token refresh endpoint
        const res = await axios.post('/api/auth/refresh', { refreshToken });
        
        if (res.data?.success) {
          const { accessToken, refreshToken: newRefreshToken } = res.data.data;
          
          localStorage.setItem('token', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login if refresh fails
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('auth-expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me/profile', data),
  changePassword: (data) => api.put('/auth/me/password', data),
};

export const urlAPI = {
  create: (data) => api.post('/urls', data),
  getAll: (params) => api.get('/urls', { params }),
  getOne: (id) => api.get(`/urls/${id}`),
  update: (id, data) => api.put(`/urls/${id}`, data),
  delete: (id) => api.delete(`/urls/${id}`),
  checkAlias: (alias) => api.get(`/urls/check-alias/${alias}`),
  bulkCreate: (formData) => api.post('/urls/bulk', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export const analyticsAPI = {
  getUrlAnalytics: (urlId) => api.get(`/analytics/${urlId}`),
  getRecentClicks: (urlId, params) => api.get(`/analytics/${urlId}/clicks`, { params }),
  getDashboardSummary: () => api.get('/analytics/dashboard/summary'),
};

export const publicAPI = {
  getStats: (shortCode) => api.get(`/public/stats/${shortCode}`),
};

export default api;
