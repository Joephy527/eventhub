import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { events } from '../db/schema';
import { eq, and, gte, lte, ilike, or, desc, asc, count } from 'drizzle-orm';
import { EventFilters, OrganizerEventFilters, PaginatedResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

export class EventService {
  async getAllEvents(filters?: EventFilters): Promise<PaginatedResponse<any>> {
    const page = filters?.page || 1;
    const pageSize = Math.min(filters?.pageSize || 20, 100); // Max 100 per page
    const offset = (page - 1) * pageSize;

    const conditions = [eq(events.isPublished, true)];

    if (filters?.category) {
      conditions.push(eq(events.category, filters.category));
    }

    if (filters?.search) {
      conditions.push(
        or(
          ilike(events.title, `%${filters.search}%`),
          ilike(events.description, `%${filters.search}%`)
        )!
      );
    }

    if (filters?.minPrice !== undefined) {
      conditions.push(gte(events.price, filters.minPrice.toString()));
    }

    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(events.price, filters.maxPrice.toString()));
    }

    if (filters?.minAvailableTickets !== undefined) {
      conditions.push(gte(events.availableTickets, filters.minAvailableTickets));
    }

    if (filters?.location) {
      conditions.push(ilike(events.location, `%${filters.location}%`));
    }

    // Get total count for pagination
    const [{ value: totalCount }] = await db
      .select({ value: count() })
      .from(events)
      .where(and(...conditions));

    // Get paginated results
    const result = await db
      .select()
      .from(events)
      .where(and(...conditions))
      .orderBy(asc(events.startDate))
      .limit(pageSize)
      .offset(offset);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data: result,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
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

  async getEventsByOrganizer(organizerId: string, filters?: OrganizerEventFilters) {
    const conditions = [eq(events.organizerId, organizerId)];

    if (filters?.status === 'published') {
      conditions.push(eq(events.isPublished, true));
    }

    if (filters?.status === 'draft') {
      conditions.push(eq(events.isPublished, false));
    }

    if (filters?.search) {
      conditions.push(
        or(
          ilike(events.title, `%${filters.search}%`),
          ilike(events.description, `%${filters.search}%`),
          ilike(events.location, `%${filters.search}%`)
        )!
      );
    }

    return await db
      .select()
      .from(events)
      .where(and(...conditions))
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
