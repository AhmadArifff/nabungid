import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { registerSchema, loginSchema, updateProfileSchema } from '@nabungid/shared';

const router = Router();

// Public routes
router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);

// Protected routes
router.get('/me', authenticateJwt, AuthController.getMe);
router.patch('/profile', authenticateJwt, validateBody(updateProfileSchema), AuthController.updateProfile);

export default router;
