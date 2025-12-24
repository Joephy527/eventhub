/**
 * Client-side API client for use in Client Components
 * Uses cached session to avoid HTTP overhead
 */
'use client';

import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Session cache to avoid refetching on every request
let sessionCache: any = null;
let sessionPromise: Promise<any> | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached session or fetch if expired
 */
async function getCachedSession() {
  const now = Date.now();

  // Return cached session if still valid
  if (sessionCache && now - cacheTime < CACHE_DURATION) {
    return sessionCache;
  }

  // If already fetching, wait for that promise
  if (sessionPromise) {
    return sessionPromise;
  }

  // Fetch new session
  sessionPromise = getSession().then((session) => {
    sessionCache = session;
    cacheTime = Date.now();
    sessionPromise = null;
    return session;
  });

  return sessionPromise;
}

/**
 * Clear session cache (call after logout)
 */
export function clearSessionCache() {
  sessionCache = null;
  cacheTime = 0;
  sessionPromise = null;
}

/**
 * Create axios instance with optimized session handling
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor with cached session
api.interceptors.request.use(
  async (config) => {
    try {
      const session = await getCachedSession();
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
    } catch (error) {
      console.error('Failed to get session:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear cache and redirect to login
      clearSessionCache();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

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
  getMyEvents: (params?: any) => api.get('/events/my-events', { params }),
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
  createIntent: (data: { eventId: string; numberOfTickets: number; idempotencyKey?: string }) =>
    api.post('/payments/intent', data),
};
