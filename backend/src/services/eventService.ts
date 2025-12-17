import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { events } from '../db/schema';
import { eq, and, gte, lte, ilike, or, desc, asc } from 'drizzle-orm';
import { EventFilters } from '../types';
import { AppError } from '../middleware/errorHandler';

export class EventService {
  async getAllEvents(filters?: EventFilters) {

    if (filters) {
      const conditions = [eq(events.isPublished, true)];

      if (filters.category) {
        conditions.push(eq(events.category, filters.category));
      }

      if (filters.search) {
        conditions.push(
          or(
            ilike(events.title, `%${filters.search}%`),
            ilike(events.description, `%${filters.search}%`)
          )!
        );
      }

      if (filters.minPrice !== undefined) {
        conditions.push(gte(events.price, filters.minPrice.toString()));
      }

      if (filters.maxPrice !== undefined) {
        conditions.push(lte(events.price, filters.maxPrice.toString()));
      }

      if (filters.location) {
        conditions.push(ilike(events.location, `%${filters.location}%`));
      }

      const result = await db
        .select()
        .from(events)
        .where(and(...conditions))
        .orderBy(asc(events.startDate));

      return result;
    }

    const result = await db
      .select()
      .from(events)
      .where(eq(events.isPublished, true))
      .orderBy(asc(events.startDate));

    return result;
  }

  async getEventById(eventId: string) {
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    return event;
  }

  async createEvent(organizerId: string, eventData: any) {
    const newEvent = {
      id: uuidv4(),
      ...eventData,
      organizerId,
      availableTickets: eventData.totalTickets,
      price: eventData.price.toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [createdEvent] = await db.insert(events).values(newEvent).returning();
    return createdEvent;
  }

  async updateEvent(eventId: string, organizerId: string, updates: any) {
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError('Not authorized to update this event', 403);
    }

    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    if (updates.price !== undefined) {
      updateData.price = updates.price.toString();
    }

    const [updatedEvent] = await db
      .update(events)
      .set(updateData)
      .where(eq(events.id, eventId))
      .returning();

    return updatedEvent;
  }

  async deleteEvent(eventId: string, organizerId: string): Promise<void> {
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError('Not authorized to delete this event', 403);
    }

    await db.delete(events).where(eq(events.id, eventId));
  }

  async getEventsByOrganizer(organizerId: string) {
    return await db
      .select()
      .from(events)
      .where(eq(events.organizerId, organizerId))
      .orderBy(desc(events.createdAt));
  }

  async getFeaturedEvents(limit: number = 6) {
    return await db
      .select()
      .from(events)
      .where(eq(events.isPublished, true))
      .orderBy(desc(events.createdAt))
      .limit(limit);
  }

  async getUpcomingEvents(limit: number = 10) {
    const now = new Date();
    return await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.isPublished, true),
          gte(events.startDate, now)
        )
      )
      .orderBy(asc(events.startDate))
      .limit(limit);
  }
}

export const eventService = new EventService();
