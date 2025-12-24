import { body, param, query, ValidationChain } from 'express-validator';

/**
 * Common validation utilities for input sanitization and validation
 */

export const validators = {
  /**
   * UUID parameter validator
   */
  uuid: (field: string = 'id'): ValidationChain =>
    param(field).isUUID().withMessage(`${field} must be a valid UUID`),

  /**
   * Email validator with normalization
   */
  email: (field: string = 'email'): ValidationChain =>
    body(field)
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),

  /**
   * Password validator with strength requirements
   */
  password: (field: string = 'password'): ValidationChain =>
    body(field)
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be between 8 and 128 characters')
      .matches(/\d/)
      .withMessage('Password must contain at least one number'),

  /**
   * Positive integer validator
   */
  positiveInt: (field: string): ValidationChain =>
    body(field)
      .isInt({ min: 1 })
      .withMessage(`${field} must be a positive integer`),

  /**
   * Date validator
   */
  date: (field: string): ValidationChain =>
    body(field).isISO8601().toDate().withMessage(`${field} must be a valid date`),

  /**
   * Sanitized text field with length limits
   */
  text: (field: string, minLength: number = 1, maxLength: number = 500): ValidationChain =>
    body(field)
      .trim()
      .isLength({ min: minLength, max: maxLength })
      .withMessage(`${field} must be between ${minLength} and ${maxLength} characters`)
      .escape(), // Escapes HTML characters

  /**
   * Sanitized search query with length limits
   */
  searchQuery: (field: string = 'search'): ValidationChain =>
    query(field)
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search query must be less than 100 characters')
      .matches(/^[a-zA-Z0-9\s\-_]*$/)
      .withMessage('Search query contains invalid characters'),

  /**
   * URL validator
   */
  url: (field: string): ValidationChain =>
    body(field)
      .trim()
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage(`${field} must be a valid URL`),

  /**
   * Pagination validators
   */
  pagination: (): ValidationChain[] => [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .toInt()
      .withMessage('Page must be a positive integer'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .toInt()
      .withMessage('Page size must be between 1 and 100'),
  ],

  /**
   * Numeric range validator
   */
  numericRange: (field: string, min: number = 0, max?: number): ValidationChain => {
    let validator = body(field).isFloat({ min });
    if (max !== undefined) {
      validator = validator.isFloat({ min, max });
    }
    return validator.withMessage(
      max !== undefined
        ? `${field} must be between ${min} and ${max}`
        : `${field} must be at least ${min}`
    );
  },
};

/**
 * Common query parameter validators
 */
export const queryValidators = {
  /**
   * Filter by category
   */
  category: query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('Invalid category format'),

  /**
   * Filter by location
   */
  location: query('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .matches(/^[a-zA-Z0-9\s,\-_]+$/)
    .withMessage('Invalid location format'),

  /**
   * Price range filters
   */
  minPrice: query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .toFloat()
    .withMessage('Minimum price must be a positive number'),

  maxPrice: query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .toFloat()
    .withMessage('Maximum price must be a positive number'),
};
