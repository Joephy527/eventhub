import { body } from 'express-validator';
import { validators } from './common';

export const createEventValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters'),
  validators.url('imageUrl'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters'),
  body('venue')
    .trim()
    .notEmpty()
    .withMessage('Venue is required')
    .isLength({ max: 200 })
    .withMessage('Venue must be less than 200 characters'),
  validators.date('startDate'),
  validators.date('endDate'),
  body('price').isFloat({ min: 0, max: 999999 }).withMessage('Price must be between 0 and 999999'),
  validators.positiveInt('totalTickets'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  body('tags')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Tags must be an array with maximum 20 items'),
];

export const updateEventValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters'),
  body('imageUrl')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Please provide a valid image URL'),
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters'),
  body('venue')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Venue cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Venue must be less than 200 characters'),
  body('startDate').optional().isISO8601().toDate().withMessage('Please provide a valid start date'),
  body('endDate').optional().isISO8601().toDate().withMessage('Please provide a valid end date'),
  body('price')
    .optional()
    .isFloat({ min: 0, max: 999999 })
    .withMessage('Price must be between 0 and 999999'),
  body('totalTickets')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total tickets must be at least 1'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  body('tags')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Tags must be an array with maximum 20 items'),
];
