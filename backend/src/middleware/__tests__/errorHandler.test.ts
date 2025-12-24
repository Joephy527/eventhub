/**
 * Error Handler Middleware Tests
 */

import { errorHandler, AppError } from '../errorHandler';
import { createMockRequest, createMockResponse } from '../../__tests__/utils/helpers';

describe('Error Handler Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = jest.fn();
  });

  describe('AppError', () => {
    it('should create AppError with message and status code', () => {
      const error = new AppError('Test error', 404);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
    });

    it('should require both message and statusCode', () => {
      const error = new AppError('Test error', 500);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });
  });

  describe('errorHandler', () => {
    it('should handle AppError with correct status code', () => {
      const error = new AppError('Not found', 404);

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Not found',
      });
    });

    it('should handle generic Error as 500 with generic message', () => {
      const error = new Error('Something went wrong');

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });

    it('should handle non-AppError with generic message for security', () => {
      const error = new Error('Database connection failed');

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });

    it('should handle errors without message', () => {
      const error = new Error();

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });

    it('should use statusCode from AppError', () => {
      const testCases = [
        { statusCode: 400, message: 'Bad Request' },
        { statusCode: 401, message: 'Unauthorized' },
        { statusCode: 403, message: 'Forbidden' },
        { statusCode: 404, message: 'Not Found' },
        { statusCode: 500, message: 'Internal Server Error' },
      ];

      testCases.forEach(({ statusCode, message }) => {
        const mockResLocal = createMockResponse();
        const error = new AppError(message, statusCode);

        errorHandler(error, mockReq, mockResLocal, mockNext);

        expect(mockResLocal.status).toHaveBeenCalledWith(statusCode);
        expect(mockResLocal.json).toHaveBeenCalledWith({
          success: false,
          error: message,
        });
      });
    });
  });
});
