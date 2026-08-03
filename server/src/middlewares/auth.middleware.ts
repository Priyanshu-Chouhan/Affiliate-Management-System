import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/common/utils/jwt';
import { sendError } from '@/common/utils/response';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    sendError(res, 'Unauthorized', 401);
    return;
  }
  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch {
    sendError(res, 'Unauthorized', 401);
  }
};
