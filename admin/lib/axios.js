import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const admin = localStorage.getItem('bagnest_admin');
    if (admin) {
      const parsed = JSON.parse(admin);
      if (parsed?.token) config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

export default API;
