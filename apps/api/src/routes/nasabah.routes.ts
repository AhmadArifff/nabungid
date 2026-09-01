import { Router } from 'express';
import { NasabahController } from '../controllers/nasabah.controller';
import { authenticateJwt, requireRole } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { paymentProofUploadSchema } from '@nabungid/shared';

const router = Router();

// All nasabah routes require authentication
router.use(authenticateJwt, requireRole('NASABAH', 'ADMIN'));

router.post('/enroll', NasabahController.enroll);
router.get('/savings', NasabahController.getMySavings);
router.post('/savings/:id/pay-week', validateBody(paymentProofUploadSchema), NasabahController.payWeek);
router.get('/savings/:id/receipt/:weekNumber', NasabahController.getReceipt);
router.patch('/savings/:id/bundle', NasabahController.selectBundle);

export default router;
