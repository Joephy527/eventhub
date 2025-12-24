/**
 * Validation Middleware Tests
 */

import { validationResult, ValidationChain } from 'express-validator';
import { validate } from '../validation';
import { createMockRequest, createMockResponse } from '../../__tests__/utils/helpers';

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Validation Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;
  let mockValidationChain: ValidationChain;
  let mockValidationResult: jest.Mock;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = jest.fn();
    mockValidationResult = validationResult as unknown as jest.Mock;

    // Mock ValidationChain with run method
    mockValidationChain = {
      run: jest.fn().mockResolvedValue(undefined),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() when there are no validation errors', async () => {
    // Mock no validation errors
    mockValidationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    const middleware = validate([mockValidationChain]);
    await middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 400 error when validation fails', async () => {
    const validationErrors = [
      { type: 'field', path: 'email', msg: 'Invalid email address' },
      { type: 'field', path: 'password', msg: 'Password too short' },
    ];

    // Mock validation errors
    mockValidationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => validationErrors,
    });

    const middleware = validate([mockValidationChain]);
    await middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Validation failed',
      details: [
        { field: 'email', message: 'Invalid email address' },
        { field: 'password', message: 'Password too short' },
      ],
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle multiple validation chains', async () => {
    const chain1 = { run: jest.fn().mockResolvedValue(undefined) } as any;
    const chain2 = { run: jest.fn().mockResolvedValue(undefined) } as any;

    mockValidationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    const middleware = validate([chain1, chain2]);
    await middleware(mockReq, mockRes, mockNext);

    expect(chain1.run).toHaveBeenCalledWith(mockReq);
    expect(chain2.run).toHaveBeenCalledWith(mockReq);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle validation errors with non-field type', async () => {
    const validationErrors = [
      { type: 'alternative', path: undefined, msg: 'Unknown error' },
      { type: 'field', path: 'email', msg: 'Invalid email' },
    ];

    mockValidationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => validationErrors,
    });

    const middleware = validate([mockValidationChain]);
    await middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Validation failed',
      details: [
        { field: 'unknown', message: 'Unknown error' },
        { field: 'email', message: 'Invalid email' },
      ],
    });
  });
});
