import { Router } from 'express';
import { authRoutes } from '@/modules/auth';
import { affiliateRoutes } from '@/modules/affiliate';
import { purchaseRoutes } from '@/modules/purchase';
import { adminRoutes } from '@/modules/admin';

const router = Router();

router.use('/auth', authRoutes);
router.use('/affiliate', affiliateRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/admin', adminRoutes);

export default router;
