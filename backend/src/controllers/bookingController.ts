import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/bookingService';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthRequest } from '../types';
import { retryAsync } from '../utils/resilience';

export class BookingController {
  async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as AuthRequest).user?.id;
      const userRole = (req as AuthRequest).user?.role;
      const { eventId, numberOfTickets, paymentIntentId } = req.body;

      const booking = await bookingService.createBooking(
        userId!,
        eventId,
        numberOfTickets,
        userRole,
        paymentIntentId
      );
      sendCreated(res, booking, 'Booking created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getBookingById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const booking = await bookingService.getBookingById(id);
      sendSuccess(res, booking, 'Booking retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMyBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as AuthRequest).user?.id;
      const bookings = await bookingService.getUserBookings(userId!);
      sendSuccess(res, bookings, 'My bookings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getEventBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { eventId } = req.params;
      const userId = (req as AuthRequest).user?.id;

      const bookings = await bookingService.getEventBookings(eventId, userId!);
      sendSuccess(res, bookings, 'Event bookings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as AuthRequest).user?.id;

      const booking = await bookingService.cancelBooking(id, userId!);
      sendSuccess(res, booking, 'Booking cancelled successfully');
    } catch (error) {
      next(error);
    }
  }

  async getBookingStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as AuthRequest).user?.id;
      const role = (req as AuthRequest).user?.role;
      const stats = await retryAsync(
        () => bookingService.getBookingStats(userId!, role),
        { retries: 1, delayMs: 200 }
      );
      sendSuccess(res, stats, 'Booking stats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const bookingController = new BookingController();
