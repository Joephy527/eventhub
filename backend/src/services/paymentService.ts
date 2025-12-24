import Stripe from 'stripe';
import { db, type DbClient, type DbTransaction } from '../db';
import { events, payments } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn('⚠️ STRIPE_SECRET_KEY is not set. Payment features will be disabled.');
}

export const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' })
  : null;

export class PaymentService {
  async createPaymentIntent(
    userId: string,
    eventId: string,
    numberOfTickets: number,
    idempotencyKey?: string
  ) {
    if (!stripe) {
      throw new AppError(
        'Payment processing is temporarily unavailable. Please try again later or contact support.',
        503
      );
    }

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
    const resolvedKey = idempotencyKey || uuidv4();

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
    }, {
      idempotencyKey: resolvedKey,
    });

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: amountInCents / 100,
      currency: intent.currency,
    };
  }

  async getPaymentIntent(paymentIntentId: string) {
    if (!stripe) {
      throw new AppError(
        'Payment processing is temporarily unavailable. Please try again later or contact support.',
        503
      );
    }
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
    dbClient = db,
  }: {
    paymentIntentId: string;
    userId: string;
    organizerId: string;
    eventId: string;
    bookingId: string;
    amount: number;
    currency: string;
    status: string;
    dbClient?: DbClient | DbTransaction;
  }) {
    const existing = await dbClient
      .select()
      .from(payments)
      .where(and(eq(payments.stripePaymentIntentId, paymentIntentId), eq(payments.userId, userId)));

    if (existing.length > 0) {
      return existing[0];
    }

    const [payment] = await dbClient
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
