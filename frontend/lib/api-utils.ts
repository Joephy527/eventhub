/**
 * API Utility Functions
 * Helper functions for working with API responses
 */

import { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse, ApiError, getErrorMessage } from '@/types';

/**
 * Handle Axios error and convert to user-friendly message
 */
export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    // Server responded with error status
    if (error.response) {
      const apiError = error.response.data as ApiError;
      return apiError.error || error.message;
    }

    // Request was made but no response received
    if (error.request) {
      return 'No response from server. Please check your connection.';
    }

    // Error setting up request
    return error.message;
  }

  return getErrorMessage(error);
}

/**
 * Extract data from Axios response with type safety
 */
export function extractResponseData<T>(response: AxiosResponse<ApiResponse<T>>): T {
  const apiResponse = response.data;

  if (!apiResponse.success) {
    throw new Error(apiResponse.error || 'Request failed');
  }

  if (!apiResponse.data) {
    throw new Error('No data in response');
  }

  return apiResponse.data;
}

/**
 * Check if error is an authentication error (401 or 403)
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 401 || error.response?.status === 403;
  }
  return false;
}

/**
 * Check if error is a validation error (400)
 */
export function isValidationError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 400;
  }
  return false;
}

/**
 * Get validation error details if available
 */
export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (error instanceof AxiosError && error.response?.status === 400) {
    const apiError = error.response.data as ApiError;
    return apiError.details || null;
  }
  return null;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: string | number, currency: string = 'USD'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(numAmount);
}

/**
 * Format date to local string
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const isPast = diffMs < 0;
  const prefix = isPast ? '' : 'in ';
  const suffix = isPast ? ' ago' : '';

  if (diffDay > 0) {
    return `${prefix}${diffDay} day${diffDay > 1 ? 's' : ''}${suffix}`;
  }
  if (diffHour > 0) {
    return `${prefix}${diffHour} hour${diffHour > 1 ? 's' : ''}${suffix}`;
  }
  if (diffMin > 0) {
    return `${prefix}${diffMin} minute${diffMin > 1 ? 's' : ''}${suffix}`;
  }
  return 'just now';
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}
