import { Router } from 'express';
import { ProgramController } from '../controllers/program.controller';

const router = Router();

router.get('/active', ProgramController.getActive);
router.get('/catalog-packages', ProgramController.getCatalogPackages);
router.get('/categories', ProgramController.getCategories);

export default router;
