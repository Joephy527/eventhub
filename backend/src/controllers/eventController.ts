import { Request, Response, NextFunction } from 'express';
import { eventService } from '../services/eventService';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';
import { AuthRequest } from '../types';

export class EventController {
  async getAllEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, search, minPrice, maxPrice, location, tags } = req.query;

      const filters = {
        category: category as string,
        search: search as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        location: location as string,
        tags: tags ? (tags as string).split(',') : undefined,
      };

      const events = await eventService.getAllEvents(filters);
      sendSuccess(res, events, 'Events retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);
      sendSuccess(res, event, 'Event retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as AuthRequest).user?.id;
      const eventData = req.body;

      const event = await eventService.createEvent(userId!, eventData);
      sendCreated(res, event, 'Event created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as AuthRequest).user?.id;
      const updates = req.body;

      const event = await eventService.updateEvent(id, userId!, updates);
      sendSuccess(res, event, 'Event updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as AuthRequest).user?.id;

      await eventService.deleteEvent(id, userId!);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async getMyEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as AuthRequest).user?.id;
      const events = await eventService.getEventsByOrganizer(userId!);
      sendSuccess(res, events, 'My events retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getFeaturedEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const events = await eventService.getFeaturedEvents(limit);
      sendSuccess(res, events, 'Featured events retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const events = await eventService.getUpcomingEvents(limit);
      sendSuccess(res, events, 'Upcoming events retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const eventController = new EventController();
