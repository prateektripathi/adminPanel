// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Staff services (Admin only)
export const staffService = {
  getAll: async () => {
    const response = await api.get('/staff');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/staff/${id}`);
    return response.data;
  },

  create: async (staffData) => {
    const response = await api.post('/staff', staffData);
    return response.data;
  },

  update: async (id, staffData) => {
    const response = await api.put(`/staff/${id}`, staffData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/staff/${id}`);
    return response.data;
  },

  assignUsers: async (staffId, userIds) => {
    const response = await api.post(`/staff/${staffId}/assign-users`, { userIds });
    return response.data;
  }
};

// Product services
export const productService = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  addTestLog: async (id, testData) => {
    const response = await api.post(`/products/${id}/test`, testData);
    return response.data;
  }
};

// Payment services
export const paymentService = {
  getAll: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  create: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  markPaid: async (id) => {
    const response = await api.post(`/payments/${id}/mark-paid`);
    return response.data;
  },

  generateInvoice: async (id) => {
    const response = await api.get(`/payments/${id}/invoice`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Bucket services
export const bucketService = {
  getAll: async () => {
    const response = await api.get('/buckets');
    return response.data;
  },

  create: async (bucketData) => {
    const response = await api.post('/buckets', bucketData);
    return response.data;
  },

  update: async (id, bucketData) => {
    const response = await api.put(`/buckets/${id}`, bucketData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/buckets/${id}`);
    return response.data;
  }
};

// Dashboard services
export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};

// Notification services
export const notificationService = {
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  create: async (notificationData) => {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  },

  markRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};

// Reports services
export const reportService = {
  getReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  customReport: async (reportData) => {
    const response = await api.post('/reports/custom', reportData);
    return response.data;
  }
};

export default api;