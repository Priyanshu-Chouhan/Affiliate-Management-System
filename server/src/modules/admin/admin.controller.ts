import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';
import { sendSuccess } from '@/common/utils/response';

export const getAffiliates = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await adminService.getAffiliates(req.query as Record<string, unknown>)); }
  catch (err) { next(err); }
};

export const getAffiliate = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await adminService.getAffiliate(req.params.id as string)); }
  catch (err) { next(err); }
};

export const getPayouts = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await adminService.getPayouts(req.query.status as string | undefined)); }
  catch (err) { next(err); }
};

export const approvePayout = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await adminService.approvePayout(req.params.id as string)); }
  catch (err) { next(err); }
};

export const rejectPayout = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await adminService.rejectPayout(req.params.id as string)); }
  catch (err) { next(err); }
};

export const approveCommission = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await adminService.approveCommission(req.params.id as string)); }
  catch (err) { next(err); }
};

export const rejectCommission = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await adminService.rejectCommission(req.params.id as string)); }
  catch (err) { next(err); }
};

export const getCommissions = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await adminService.getCommissions()); }
  catch (err) { next(err); }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await adminService.getStats()); }
  catch (err) { next(err); }
};

export const getTopAffiliates = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await adminService.getTopAffiliates()); }
  catch (err) { next(err); }
};
