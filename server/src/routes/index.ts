import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';
import affiliateRoutes from '@/modules/affiliate/affiliate.routes';
import purchaseRoutes from '@/modules/purchase/purchase.routes';
import adminRoutes from '@/modules/admin/admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/affiliate', affiliateRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/admin', adminRoutes);

export default router;
