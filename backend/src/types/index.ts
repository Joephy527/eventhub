import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'organizer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  location: string;
  venue: string;
  startDate: Date;
  endDate: Date;
  price: number;
  totalTickets: number;
  availableTickets: number;
  organizerId: string;
  isPublished: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  numberOfTickets: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface EventFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: Date;
  location?: string;
  tags?: string[];
}
