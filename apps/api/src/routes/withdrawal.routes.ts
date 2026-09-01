import { Router } from 'express';
import { WithdrawalController } from '../controllers/withdrawal.controller';
import { authenticateJwt, requireRole } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { emergencyWithdrawalRequestSchema } from '@nabungid/shared';

const router = Router();

router.use(authenticateJwt, requireRole('NASABAH', 'ADMIN'));

router.post(
  '/request',
  validateBody(emergencyWithdrawalRequestSchema),
  WithdrawalController.requestWithdrawal
);
router.get('/status', WithdrawalController.getStatus);

export default router;
