import { Request, Response, NextFunction } from 'express';
import { createPurchase } from './purchase.service';
import { sendSuccess } from '@/common/utils/response';
import { AppError } from '@/common/errors/AppError';

export const purchase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');
    const result = await createPurchase(req.user.userId, req.body);
    sendSuccess(res, result, 201);
  } catch (err) { next(err); }
};
