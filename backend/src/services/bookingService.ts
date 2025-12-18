import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { bookings, events, payments } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler';
import { paymentService } from './paymentService';

export class BookingService {
  async createBooking(
    userId: string,
    eventId: string,
    numberOfTickets: number,
    userRole: string | undefined,
    paymentIntentId: string
  ) {
    if (userRole === 'organizer') {
      throw new AppError('Organizers cannot book tickets', 403);
    }

    if (!paymentIntentId) {
      throw new AppError('Payment is required before booking', 400);
    }

    if (numberOfTickets <= 0) {
      throw new AppError('Number of tickets must be greater than 0', 400);
    }

    // Verify payment intent
    const intent = await paymentService.getPaymentIntent(paymentIntentId);
    if (intent.status !== 'succeeded') {
      throw new AppError('Payment not completed', 400);
    }

    const intentAmount = (intent.amount_received ?? intent.amount ?? 0) / 100;

    if (intent.metadata?.eventId !== eventId || intent.metadata?.userId !== userId) {
      throw new AppError('Payment does not match booking details', 400);
    }

    const now = new Date();

    const booking = await db.transaction(async tx => {
      const [event] = await tx
        .select()
        .from(events)
        .where(eq(events.id, eventId))
        .limit(1);

      if (!event) {
        throw new AppError('Event not found', 404);
      }

      if (event.availableTickets < numberOfTickets) {
        throw new AppError('Not enough tickets available', 400);
      }

      const totalAmount = parseFloat(event.price) * numberOfTickets;
      if (Math.abs(intentAmount - totalAmount) > 0.01) {
        throw new AppError('Payment amount mismatch', 400);
      }

      const [createdBooking] = await tx
        .insert(bookings)
        .values({
          id: uuidv4(),
          eventId,
          userId,
          numberOfTickets,
          totalAmount: totalAmount.toString(),
          status: 'confirmed' as const,
          bookingDate: now,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      await tx
        .update(events)
        .set({
          availableTickets: event.availableTickets - numberOfTickets,
          updatedAt: now,
        })
        .where(eq(events.id, eventId));

      await paymentService.recordPayment({
        paymentIntentId,
        userId,
        organizerId: event.organizerId,
        eventId,
        bookingId: createdBooking.id,
        amount: totalAmount,
        currency: 'usd',
        status: intent.status,
        dbClient: tx,
      });

      return createdBooking;
    });

    return booking;
  }

  async getBookingById(bookingId: string) {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    return booking;
  }

  async getUserBookings(userId: string) {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId));
  }

  async getEventBookings(eventId: string, organizerId: string) {
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError('Not authorized to view bookings for this event', 403);
    }

    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.eventId, eventId));
  }

  async cancelBooking(bookingId: string, userId: string) {
    const now = new Date();

    const updatedBooking = await db.transaction(async tx => {
      const [booking] = await tx
        .select()
        .from(bookings)
        .where(eq(bookings.id, bookingId))
        .limit(1);

      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      if (booking.userId !== userId) {
        throw new AppError('Not authorized to cancel this booking', 403);
      }

      if (booking.status === 'cancelled') {
        throw new AppError('Booking is already cancelled', 400);
      }

      const [event] = await tx
        .select()
        .from(events)
        .where(eq(events.id, booking.eventId))
        .limit(1);

      if (event) {
        await tx
          .update(events)
          .set({
            availableTickets: event.availableTickets + booking.numberOfTickets,
            updatedAt: now,
          })
          .where(eq(events.id, event.id));
      }

      const [cancelled] = await tx
        .update(bookings)
        .set({
          status: 'cancelled',
          updatedAt: now,
        })
        .where(eq(bookings.id, bookingId))
        .returning();

      return cancelled;
    });

    return updatedBooking;
  }

  async getBookingStats(userId: string, role?: string): Promise<{
    totalBookings: number;
    upcomingEvents: number;
    totalSpent: number;
    totalEarned?: number;
  }> {
    const now = new Date();

    if (role === 'organizer' || role === 'admin') {
      // Organizer stats
      const organizerEvents = await db
        .select()
        .from(events)
        .where(eq(events.organizerId, userId));

      const upcomingEvents = organizerEvents.filter(event => new Date(event.startDate) > now).length;

      const paymentsRows = await db
        .select()
        .from(payments)
        .where(and(eq(payments.organizerId, userId), eq(payments.status, 'succeeded')));

      const totalEarned = paymentsRows.reduce(
        (sum, payment) => sum + parseFloat(payment.amount),
        0
      );

      return {
        totalBookings: paymentsRows.length,
        upcomingEvents,
        totalSpent: 0,
        totalEarned,
      };
    }

    const userBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.userId, userId),
          eq(bookings.status, 'confirmed')
        )
      );

    let upcomingEvents = 0;

    for (const booking of userBookings) {
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, booking.eventId))
        .limit(1);

      if (event && new Date(event.startDate) > now) {
        upcomingEvents++;
      }
    }

    const paymentRows = await db
      .select()
      .from(payments)
      .where(and(eq(payments.userId, userId), eq(payments.status, 'succeeded')));

    const totalSpent = paymentRows.reduce(
      (sum, payment) => sum + parseFloat(payment.amount),
      0
    );

    return {
      totalBookings: userBookings.length,
      upcomingEvents,
      totalSpent,
      totalEarned: 0,
    };
  }
}

export const bookingService = new BookingService();
