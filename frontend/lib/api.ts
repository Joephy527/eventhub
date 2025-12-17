import axios from 'axios';
import { auth } from '@/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token from session
api.interceptors.request.use(
  async (config) => {
    // For server-side requests
    if (typeof window === 'undefined') {
      const session = await auth();
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
    } else {
      // For client-side requests - get token from the session via a fetch
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        if (session?.user?.accessToken) {
          config.headers.Authorization = `Bearer ${session.user.accessToken}`;
        }
      } catch (error) {
        console.error('Failed to get session:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Let Auth.js handle session expiration
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Client-side API helper that includes token
export const createAuthorizedAPI = (accessToken: string) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Auth APIs (no token needed)
export const authAPI = {
  register: (data: any) => axios.post(`${API_URL}/auth/register`, data),
  login: (data: any) => axios.post(`${API_URL}/auth/login`, data),
};

// Event APIs
export const eventAPI = {
  getAll: (params?: any) => api.get('/events', { params }),
  getById: (id: string) => api.get(`/events/${id}`),
  getFeatured: (limit?: number) => api.get('/events/featured', { params: { limit } }),
  getUpcoming: (limit?: number) => api.get('/events/upcoming', { params: { limit } }),
  getMyEvents: () => api.get('/events/my-events'),
  create: (data: any) => api.post('/events', data),
  update: (id: string, data: any) => api.put(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
};

// Booking APIs
export const bookingAPI = {
  create: (data: any) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getById: (id: string) => api.get(`/bookings/${id}`),
  getStats: () => api.get('/bookings/stats'),
  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`),
};

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  getBySlug: (slug: string) => api.get(`/categories/slug/${slug}`),
};

// Payments APIs
export const paymentAPI = {
  createIntent: (data: { eventId: string; numberOfTickets: number }) =>
    api.post('/payments/intent', data),
};
