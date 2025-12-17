import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { AuthRequest } from '../types';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'No token provided', 401);
      return;
    }

    const token = authHeader.substring(7);

    const decoded = verifyToken(token);
    (req as AuthRequest).user = decoded;

    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token', 401);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;

    if (!user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }

    if (!roles.includes(user.role)) {
      sendError(res, 'Not authorized to access this resource', 403);
      return;
    }

    next();
  };
};
