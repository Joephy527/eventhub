import { body } from 'express-validator';

export const createBookingValidator = [
  body('eventId').trim().notEmpty().withMessage('Event ID is required'),
  body('numberOfTickets')
    .isInt({ min: 1 })
    .withMessage('Number of tickets must be at least 1'),
  body('paymentIntentId').trim().notEmpty().withMessage('Payment intent is required'),
];
