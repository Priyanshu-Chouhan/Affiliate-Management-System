import { Router } from 'express';
import { authenticate } from '@/middlewares/auth.middleware';
import { requireRole } from '@/middlewares/role.middleware';
import * as adminController from './admin.controller';

const router = Router();
router.use(authenticate, requireRole('admin'));

router.get('/affiliates', adminController.getAffiliates);
router.get('/affiliates/:id', adminController.getAffiliate);
router.get('/payouts', adminController.getPayouts);
router.patch('/payouts/:id/approve', adminController.approvePayout);
router.patch('/payouts/:id/reject', adminController.rejectPayout);
router.get('/commissions', adminController.getCommissions);
router.patch('/commissions/:id/approve', adminController.approveCommission);
router.patch('/commissions/:id/reject', adminController.rejectCommission);
router.get('/stats', adminController.getStats);
router.get('/top-affiliates', adminController.getTopAffiliates);

export default router;
