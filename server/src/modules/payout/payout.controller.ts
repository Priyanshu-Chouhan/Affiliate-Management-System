import { Request, Response, NextFunction } from 'express';
import { payoutSchema, requestPayout, getPayoutHistory } from './payout.service';
import { sendSuccess } from '@/common/utils/response';
import { AppError } from '@/common/errors/AppError';

const userId = (req: Request) => {
  if (!req.user) throw new AppError(401, 'Unauthorized');
  return req.user.userId;
};

export const request = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = payoutSchema.parse(req.body);
    sendSuccess(res, await requestPayout(userId(req), dto), 201);
  } catch (err) { next(err); }
};

export const history = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await getPayoutHistory(userId(req))); }
  catch (err) { next(err); }
};
