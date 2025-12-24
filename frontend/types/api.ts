/**
 * API Response Types
 * Shared types for API communication between frontend and backend
 */

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Pagination Metadata
export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

// Error Response
export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

// Success Response
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

// Type guard to check if response is an error
export function isApiError(response: ApiResponse): response is ApiError {
  return response.success === false;
}

// Type guard to check if response is successful
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.success === true && response.data !== undefined;
}

// Helper to extract data from API response with type safety
export function extractData<T>(response: ApiResponse<T>): T {
  if (isApiSuccess(response)) {
    return response.data;
  }
  throw new Error(response.error || 'Unknown error occurred');
}

// Helper to handle API errors
export function getErrorMessage(response: ApiResponse | Error | unknown): string {
  if (response instanceof Error) {
    return response.message;
  }

  if (typeof response === 'object' && response !== null) {
    const apiResponse = response as ApiResponse;
    if (isApiError(apiResponse)) {
      return apiResponse.error;
    }
  }

  return 'An unexpected error occurred';
}
