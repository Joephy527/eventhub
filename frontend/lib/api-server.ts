/**
 * Server-side API client for use in Server Components and Server Actions
 * Uses auth() directly without HTTP overhead
 */
import axios from 'axios';
import { auth } from '@/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Create an API client for server-side use
 * Automatically includes auth token from server session
 */
export async function createServerAPI() {
  const session = await auth();

  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.user?.accessToken && {
        Authorization: `Bearer ${session.user.accessToken}`,
      }),
    },
  });
}

// Event APIs
export const serverEventAPI = {
  getAll: async (params?: any) => {
    const api = await createServerAPI();
    return api.get('/events', { params });
  },
  getById: async (id: string) => {
    const api = await createServerAPI();
    return api.get(`/events/${id}`);
  },
  getFeatured: async (limit?: number) => {
    const api = await createServerAPI();
    return api.get('/events/featured', { params: { limit } });
  },
  getUpcoming: async (limit?: number) => {
    const api = await createServerAPI();
    return api.get('/events/upcoming', { params: { limit } });
  },
  getMyEvents: async (params?: any) => {
    const api = await createServerAPI();
    return api.get('/events/my-events', { params });
  },
};

// Booking APIs
export const serverBookingAPI = {
  getMyBookings: async () => {
    const api = await createServerAPI();
    return api.get('/bookings/my-bookings');
  },
  getStats: async () => {
    const api = await createServerAPI();
    return api.get('/bookings/stats');
  },
};

// Category APIs
export const serverCategoryAPI = {
  getAll: async () => {
    const api = await createServerAPI();
    return api.get('/categories');
  },
  getById: async (id: string) => {
    const api = await createServerAPI();
    return api.get(`/categories/${id}`);
  },
  getBySlug: async (slug: string) => {
    const api = await createServerAPI();
    return api.get(`/categories/slug/${slug}`);
  },
};
