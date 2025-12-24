import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { paymentController } from '../controllers/paymentController';
import { paymentLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply strict rate limiting to payment endpoints (10 per 15 min)
router.post('/intent', paymentLimiter, authenticate, paymentController.createIntent);

export default router;
