// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: "https://banking-backend-0ssd.onrender.com/api",
});

// Add interceptor to attach token from localStorage
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // assuming token is stored here after login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
