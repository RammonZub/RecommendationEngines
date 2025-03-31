import axios from 'axios';

// Use static ngrok URL for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://blindly-curious-grackle.ngrok-free.app';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Enable credentials for CORS
  withCredentials: false,
  // Longer timeout
  timeout: 10000,
});

// Add request interceptor with client-side check
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url ? (config.baseURL || '') + config.url : config.baseURL);
    console.log('Request method:', config.method || 'unknown');
    console.log('Request headers:', config.headers);
    
    // Ensure proper content type for GET requests
    if (config.method?.toLowerCase() === 'get') {
      config.headers.Accept = 'application/json';
    }
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received from:', response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export const restaurantApi = {
  getAll: async (filters?: {
    cuisine_type?: string;
    neighborhood?: string;
    min_rating?: number;
    price_range?: string;
  }) => {
    console.log('Calling getAll with filters:', filters);
    try {
      const response = await api.get('/api/restaurants', { params: filters });
      console.log('getAll response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/api/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting restaurant ${id}:`, error);
      throw error;
    }
  },

  getRecommendations: async () => {
    try {
      const response = await api.get('/api/recommendations');
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  },
};

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    // Store token in localStorage
    if (typeof window !== 'undefined' && response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  register: async (email: string, password: string, name?: string) => {
    const response = await api.post('/register', { email, password, name });
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }
};

export default api; 