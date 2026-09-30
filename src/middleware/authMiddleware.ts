import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
  accessToken?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const signingSecret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET;
    if (!signingSecret) throw new Error('JWT secret is not configured');
    const decoded = jwt.verify(token, signingSecret) as { userId?: string; sub?: string; email: string };
    const userId = decoded.userId || decoded.sub;
    if (!userId) throw new Error('JWT subject is missing');
    req.user = { userId, email: decoded.email };
    req.accessToken = token;
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
