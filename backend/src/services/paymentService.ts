import Stripe from 'stripe';
import { db } from '../db';
import { events, payments } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn('⚠️ STRIPE_SECRET_KEY is not set. Payment endpoints will fail.');
}

export const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' })
  : null;

export class PaymentService {
  async createPaymentIntent(userId: string, eventId: string, numberOfTickets: number) {
    if (!stripe) throw new AppError('Stripe not configured', 500);

    const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (numberOfTickets <= 0) {
      throw new AppError('Number of tickets must be greater than 0', 400);
    }

    if (event.availableTickets < numberOfTickets) {
      throw new AppError('Not enough tickets available', 400);
    }

    const amountInCents = Math.round(parseFloat(event.price) * 100 * numberOfTickets);

    const intent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        eventId,
        userId,
        organizerId: event.organizerId,
        numberOfTickets: numberOfTickets.toString(),
      },
      payment_method_types: ['card'],
    });

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: amountInCents / 100,
      currency: intent.currency,
    };
  }

  async getPaymentIntent(paymentIntentId: string) {
    if (!stripe) throw new AppError('Stripe not configured', 500);
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async recordPayment({
    paymentIntentId,
    userId,
    organizerId,
    eventId,
    bookingId,
    amount,
    currency,
    status,
  }: {
    paymentIntentId: string;
    userId: string;
    organizerId: string;
    eventId: string;
    bookingId: string;
    amount: number;
    currency: string;
    status: string;
  }) {
    const existing = await db
      .select()
      .from(payments)
      .where(and(eq(payments.stripePaymentIntentId, paymentIntentId), eq(payments.userId, userId)));

    if (existing.length > 0) {
      return existing[0];
    }

    const [payment] = await db
      .insert(payments)
      .values({
        userId,
        organizerId,
        eventId,
        bookingId,
        amount: amount.toString(),
        currency,
        stripePaymentIntentId: paymentIntentId,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return payment;
  }
}

export const paymentService = new PaymentService();
