import { Router } from 'express';
import { eventController } from '../controllers/eventController';
import { validate } from '../middleware/validation';
import { createEventValidator, updateEventValidator } from '../validators/eventValidators';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', eventController.getAllEvents);
router.get('/featured', eventController.getFeaturedEvents);
router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/my-events', authenticate, authorize('organizer', 'admin'), eventController.getMyEvents);
router.get('/:id', eventController.getEventById);

router.post(
  '/',
  authenticate,
  authorize('organizer', 'admin'),
  validate(createEventValidator),
  eventController.createEvent
);

router.put(
  '/:id',
  authenticate,
  authorize('organizer', 'admin'),
  validate(updateEventValidator),
  eventController.updateEvent
);

router.delete(
  '/:id',
  authenticate,
  authorize('organizer', 'admin'),
  eventController.deleteEvent
);

export default router;
