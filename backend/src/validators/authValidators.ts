import { body } from 'express-validator';
import { validators } from './common';

export const registerValidator = [
  validators.email('email'),
  validators.password('password'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be less than 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('First name contains invalid characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be less than 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('Last name contains invalid characters'),
  body('role')
    .optional()
    .isIn(['user', 'organizer'])
    .withMessage('Role must be either user or organizer'),
];

export const loginValidator = [
  validators.email('email'),
  body('password').notEmpty().withMessage('Password is required'),
];
