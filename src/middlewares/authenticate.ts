import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError';
import { TRole } from '../modules/users/user_interface';

export type TAuthUser = {
  id: string;
  name: string;
  email: string;
  role: TRole;
};

declare global {
  namespace Express {
    interface Request {
      user?: TAuthUser;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Unauthorized! Please login.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN!) as TAuthUser;

    req.user = decoded;
    next();
  } catch (err) {
    next(
      err instanceof AppError
        ? err
        : new AppError(401, 'Invalid or expired token.'),
    );
  }
};
