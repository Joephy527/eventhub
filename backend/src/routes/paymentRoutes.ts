import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { paymentController } from '../controllers/paymentController';

const router = Router();

router.post('/intent', authenticate, paymentController.createIntent);

export default router;
