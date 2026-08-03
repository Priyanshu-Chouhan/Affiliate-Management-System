import { Router } from 'express';
import * as payoutController from './payout.controller';

const router = Router({ mergeParams: true });
router.post('/', payoutController.request);
router.get('/history', payoutController.history);
export default router;
