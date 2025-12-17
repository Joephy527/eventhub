import { body } from 'express-validator';

export const createEventValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('imageUrl').trim().isURL().withMessage('Please provide a valid image URL'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('startDate').isISO8601().withMessage('Please provide a valid start date'),
  body('endDate').isISO8601().withMessage('Please provide a valid end date'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('totalTickets')
    .isInt({ min: 1 })
    .withMessage('Total tickets must be at least 1'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];

export const updateEventValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('imageUrl').optional().trim().isURL().withMessage('Please provide a valid image URL'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('venue').optional().trim().notEmpty().withMessage('Venue cannot be empty'),
  body('startDate').optional().isISO8601().withMessage('Please provide a valid start date'),
  body('endDate').optional().isISO8601().withMessage('Please provide a valid end date'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('totalTickets')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total tickets must be at least 1'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];
