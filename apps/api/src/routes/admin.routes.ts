import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { SystemController } from '../controllers/system.controller';
import { authenticateJwt, requireRole } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { updateMaintenanceSchema } from '@nabungid/shared';

const router = Router();

// Require ADMIN role for all endpoints in this router
router.use(authenticateJwt, requireRole('ADMIN'));

router.get('/dashboard/summary', AdminController.getSummary);
router.get('/ledgers/matrix', AdminController.getAttendanceMatrix);
router.post('/ledgers/quick-cash', AdminController.quickCashCheckin);
router.post('/ledgers/toggle-status', AdminController.toggleLedgerStatus);
router.post('/broadcast/whatsapp-reminder', AdminController.triggerWhatsAppReminder);
router.get('/ledgers/pending', AdminController.getPendingLedgers);
router.patch('/ledgers/:id/verify', AdminController.verifyLedger);
router.get('/withdrawals', AdminController.getPendingWithdrawals);
router.patch('/withdrawals/:id/decision', AdminController.decideWithdrawal);
router.get('/distribution/calculate-batch', AdminController.getDistributionBatch);

// System Maintenance Controls
router.get('/system/maintenance', SystemController.getMaintenanceDetails);
router.post('/system/maintenance', validateBody(updateMaintenanceSchema), SystemController.updateMaintenance);

export default router;
