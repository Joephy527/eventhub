import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';
import { validate } from '../middleware/validation';
import { createBookingValidator } from '../validators/bookingValidators';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', validate(createBookingValidator), bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);
router.get('/stats', bookingController.getBookingStats);
router.get('/event/:eventId', bookingController.getEventBookings);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/cancel', bookingController.cancelBooking);

export default router;
