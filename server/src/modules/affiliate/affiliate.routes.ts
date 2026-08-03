import { Router } from 'express';
import { authenticate } from '@/middlewares/auth.middleware';
import * as affiliateController from './affiliate.controller';
import payoutRoutes from '@/modules/payout/payout.routes';

const router = Router();
router.use(authenticate);
router.get('/referral-link', affiliateController.getReferralLink);
router.get('/dashboard', affiliateController.getDashboard);
router.get('/referrals', affiliateController.getReferrals);
router.get('/commissions', affiliateController.getCommissions);
router.use('/payout', payoutRoutes);
export default router;
