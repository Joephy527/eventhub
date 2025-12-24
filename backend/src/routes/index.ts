import { Router } from 'express';
import authRoutes from './authRoutes';
import eventRoutes from './eventRoutes';
import bookingRoutes from './bookingRoutes';
import categoryRoutes from './categoryRoutes';
import paymentRoutes from './paymentRoutes';
import healthRoutes from './healthRoutes';

const router = Router();

// Health check routes (no /api prefix needed, used by load balancers)
router.use('/', healthRoutes);

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/bookings', bookingRoutes);
router.use('/categories', categoryRoutes);
router.use('/payments', paymentRoutes);

export default router;
