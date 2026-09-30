import { Response, NextFunction } from 'express';
import { contactModel } from '../models/contactModel';
import { AuthRequest } from '../middleware/authMiddleware';

export const contactController = {
  async getContacts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });
      const data = await contactModel.getByUser(req.user.userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async addContact(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });
      const { name, phone, email } = req.body;
      const data = await contactModel.create({
        user_id: req.user.userId,
        name,
        phone,
        email
      });
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async deleteContact(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });
      await contactModel.delete(req.params.id as string);
      res.status(200).json({ success: true, message: 'Contact deleted' });
    } catch (error) {
      next(error);
    }
  }
};
