import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL_PRO || 'https://girly-app.vercel.app';

console.log('Current environment:', import.meta.env.MODE);
console.log('API URL:', baseURL);

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;