/**
 * Domain Models
 * Type definitions for core business entities
 */

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'organizer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export type UserRole = User['role'];

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  location: string;
  venue: string;
  startDate: string;
  endDate: string;
  price: string;
  totalTickets: number;
  availableTickets: number;
  organizerId: string;
  isPublished: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  location?: string;
  tags?: string[];
  minAvailableTickets?: number;
  page?: number;
  pageSize?: number;
}

// Booking types
export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  numberOfTickets: number;
  totalAmount: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = Booking['status'];

export interface BookingWithEvent extends Booking {
  event: Event;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

// Payment types
export interface Payment {
  id: string;
  userId: string;
  organizerId: string;
  eventId: string;
  bookingId: string;
  amount: string;
  currency: string;
  status: string;
  stripePaymentIntentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

// Statistics types
export interface BookingStats {
  totalBookings: number;
  upcomingEvents: number;
  totalSpent: number;
  totalEarned?: number;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Form data types
export interface CreateEventData {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  location: string;
  venue: string;
  startDate: string;
  endDate: string;
  price: string;
  totalTickets: number;
  tags: string[];
  isPublished: boolean;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}

export interface CreateBookingData {
  eventId: string;
  numberOfTickets: number;
  paymentIntentId: string;
}
