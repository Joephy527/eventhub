import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validate } from '../middleware/validation';
import { registerValidator, loginValidator } from '../validators/authValidators';
import { authenticate } from '../middleware/auth';
import { authLimiter, registrationLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply strict rate limiting to registration (3 per hour)
router.post('/register', registrationLimiter, validate(registerValidator), authController.register);

// Apply auth rate limiting to login (5 per 15 min)
router.post('/login', authLimiter, validate(loginValidator), authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);

// OAuth with auth limiter
router.post('/oauth', authLimiter, authController.oauthLogin);

export default router;
