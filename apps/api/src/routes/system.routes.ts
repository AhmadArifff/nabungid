import { Router } from 'express';
import { SystemController } from '../controllers/system.controller';

const router = Router();

// GET /api/v1/system/status (Public - Digunakan oleh web client & nasabah)
router.get('/status', SystemController.getPublicStatus);

export const systemRoutes = router;
