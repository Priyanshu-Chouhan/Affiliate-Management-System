import { Request, Response, NextFunction } from 'express';
import * as affiliateService from './affiliate.service';
import { sendSuccess } from '@/common/utils/response';
import { AppError } from '@/common/errors/AppError';

const userId = (req: Request) => {
  if (!req.user) throw new AppError(401, 'Unauthorized');
  return req.user.userId;
};

export const getReferralLink = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await affiliateService.getReferralLink(userId(req))); }
  catch (err) { next(err); }
};

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await affiliateService.getDashboard(userId(req))); }
  catch (err) { next(err); }
};

export const getReferrals = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await affiliateService.getReferrals(userId(req), req.query as Record<string, unknown>)); }
  catch (err) { next(err); }
};

export const getCommissions = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await affiliateService.getCommissions(userId(req), req.query as Record<string, unknown>)); }
  catch (err) { next(err); }
};
