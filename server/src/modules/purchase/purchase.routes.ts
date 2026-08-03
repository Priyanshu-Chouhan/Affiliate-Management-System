import { Router } from 'express';
import { authenticate } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { purchaseSchema } from './purchase.service';
import { purchase } from './purchase.controller';

const router = Router();
router.post('/', authenticate, validate(purchaseSchema), purchase);
export default router;
