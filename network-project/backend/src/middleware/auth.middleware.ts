// Core
import { Request, Response, NextFunction } from 'express';

// Libraries
import jwt from 'jsonwebtoken';

// Define JWT payload type
interface JwtPayload {
  id: number;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  iat: number;
  exp: number;
}

// Extend Express Request to include typed user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/** Protect routes by validating JWT token */
export const protect = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ error: 'Not authorized, no token' });
};

/** Middleware to check if the authenticated user is an admin */
export const verifyAdmin = (req: Request, res: Response, next: NextFunction): Response | void => {
  if (req.user?.role === 'ADMIN') {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized as an admin' });
};
