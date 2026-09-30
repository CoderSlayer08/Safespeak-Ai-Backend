import { Request, Response, NextFunction } from 'express';
import { sosModel } from '../models/sosModel';
import { AuthRequest } from '../middleware/authMiddleware';

export const sosController = {
  async createSOS(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });

      const sosData = {
        ...req.body,
        user_id: req.user.userId
      };

      const data = await sosModel.create(sosData);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getSOS(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });

      const data = await sosModel.getByUser(req.user.userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getSOSById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });

      const data = await sosModel.getById(req.params.id as string);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });

      const { status } = req.body;
      if (!status) return res.status(400).json({ success: false, message: 'Status required' });

      const data = await sosModel.updateStatus(req.params.id as string, status);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
};
