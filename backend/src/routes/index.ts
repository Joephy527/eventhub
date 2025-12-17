import { Router } from 'express';
import authRoutes from './authRoutes';
import eventRoutes from './eventRoutes';
import bookingRoutes from './bookingRoutes';
import categoryRoutes from './categoryRoutes';
import paymentRoutes from './paymentRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/bookings', bookingRoutes);
router.use('/categories', categoryRoutes);
router.use('/payments', paymentRoutes);

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'EventHub API is running!',
    timestamp: new Date().toISOString(),
  });
});

export default router;
