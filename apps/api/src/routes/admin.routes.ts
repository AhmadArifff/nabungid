import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateJwt, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Require ADMIN role for all endpoints in this router
router.use(authenticateJwt, requireRole('ADMIN'));

router.get('/dashboard/summary', AdminController.getSummary);
router.get('/ledgers/pending', AdminController.getPendingLedgers);
router.patch('/ledgers/:id/verify', AdminController.verifyLedger);
router.get('/withdrawals', AdminController.getPendingWithdrawals);
router.patch('/withdrawals/:id/decision', AdminController.decideWithdrawal);
router.get('/distribution/calculate-batch', AdminController.getDistributionBatch);

export default router;
