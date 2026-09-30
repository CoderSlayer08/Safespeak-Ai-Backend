import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 20;
const requests = new Map<string, { count: number; resetAt: number }>();

export const aiRateLimit = (req: AuthRequest, res: Response, next: NextFunction) => {
  const key = req.user?.userId;
  if (!key) return res.status(401).json({ success: false, message: 'Not authorized' });

  const now = Date.now();
  const entry = requests.get(key);
  if (!entry || entry.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (entry.count >= MAX_REQUESTS) {
    res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
    return res.status(429).json({ success: false, message: 'AI request limit reached. Please try again shortly.' });
  }

  entry.count += 1;
  next();
};
