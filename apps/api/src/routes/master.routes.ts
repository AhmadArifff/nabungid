import { Router } from 'express';
import { MasterController } from '../controllers/master.controller';
import { authenticateJwt, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Require ADMIN role for all master data endpoints
router.use(authenticateJwt, requireRole('ADMIN'));

// Items
router.post('/items', MasterController.createItem);
router.patch('/items/:id', MasterController.updateItem);
router.delete('/items/:id', MasterController.deleteItem);

// Bundles
router.post('/bundles', MasterController.createBundle);
router.delete('/bundles/:id', MasterController.deleteBundle);

// Programs
router.post('/programs', MasterController.createProgram);

export default router;
