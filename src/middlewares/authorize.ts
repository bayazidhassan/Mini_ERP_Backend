import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';
import { TRole } from '../modules/users/user_interface';

export const authorize = (...roles: TRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Unauthorized! Please login.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          `Access denied. Required role: ${roles.join(' or ')}.`,
        ),
      );
    }

    next();
  };
};
