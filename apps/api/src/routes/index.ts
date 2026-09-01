import { Router } from 'express';
import authRoutes from './auth.routes';
import programRoutes from './program.routes';
import nasabahRoutes from './nasabah.routes';
import withdrawalRoutes from './withdrawal.routes';
import adminRoutes from './admin.routes';
import masterRoutes from './master.routes';

const rootRouter = Router();

// Mount API v1 modules
rootRouter.use('/auth', authRoutes);
rootRouter.use('/programs', programRoutes);
rootRouter.use('/nasabah', nasabahRoutes);
rootRouter.use('/withdrawals', withdrawalRoutes);
rootRouter.use('/admin', adminRoutes);
rootRouter.use('/admin/master', masterRoutes);

// Health check endpoint
rootRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'NabungID Backend REST API',
    timestamp: new Date().toISOString(),
  });
});

export default rootRouter;
