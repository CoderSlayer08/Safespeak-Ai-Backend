import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { userModel } from '../models/userModel';
import { AuthRequest } from '../middleware/authMiddleware';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const data = await authService.register(name, email, password);
      res.status(201).json({
        success: true,
        data
      });
    } catch (error: any) {
      if (error.message === 'User already exists') {
        return res.status(400).json({ success: false, message: error.message });
      }
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error: any) {
      if (error.message === 'Invalid email or password') {
        return res.status(401).json({ success: false, message: error.message });
      }
      next(error);
    }
  },

  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      const user = await userModel.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
