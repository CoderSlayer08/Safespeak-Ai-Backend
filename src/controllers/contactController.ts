import { Response, NextFunction } from 'express';
import { contactModel } from '../models/contactModel';
import { AuthRequest } from '../middleware/authMiddleware';

export const contactController = {
  async getContacts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });
      const data = await contactModel.getByUser(req.accessToken!, req.user.userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async addContact(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });
      const { name, phone, email } = req.body;
      if (typeof name !== 'string' || !name.trim() || typeof phone !== 'string' || !phone.trim() || (email !== undefined && (typeof email !== 'string' || email.length > 254))) {
        return res.status(400).json({ success: false, message: 'A contact name and phone are required' });
      }
      const data = await contactModel.create(req.accessToken!, {
        user_id: req.user.userId,
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || ''
      });
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async deleteContact(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });
      const deleted = await contactModel.delete(req.accessToken!, req.params.id as string, req.user.userId);
      if (!deleted) return res.status(404).json({ success: false, message: 'Contact not found' });
      res.status(200).json({ success: true, message: 'Contact deleted' });
    } catch (error) {
      next(error);
    }
  }
};
