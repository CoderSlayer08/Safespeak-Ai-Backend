import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validate, registerSchema, loginSchema } from '../validators/authValidator';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.getMe);

export default router;
