import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validate } from '../middleware/validation';
import { registerValidator, loginValidator } from '../validators/authValidators';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', validate(registerValidator), authController.register);
router.post('/login', validate(loginValidator), authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.post('/oauth', authController.oauthLogin);

export default router;
