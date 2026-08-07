import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '@/common/errors/AppError';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, error: err.message });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({ success: false, error: err.errors[0].message });
    return;
  }
  console.error(err);
  res.status(500).json({ success: false, error: 'Internal server error' });
};
