import { Request, Response, NextFunction } from 'express';
import { sosModel } from '../models/sosModel';
import { AuthRequest } from '../middleware/authMiddleware';

export const sosController = {
  async createSOS(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });

      const { incident_type, severity, people_involved, injury_reported, hazard_reported, summary, recommended_action, latitude, longitude, location_accuracy } = req.body;
      const validSeverity = ['Low', 'Medium', 'High', 'Critical', 'Unknown'];
      if (typeof incident_type !== 'string' || !incident_type.trim() || incident_type.length > 120 || !validSeverity.includes(severity) || typeof injury_reported !== 'boolean' || typeof hazard_reported !== 'boolean' || typeof summary !== 'string' || !summary.trim() || summary.length > 2000 || typeof recommended_action !== 'string' || !recommended_action.trim() || recommended_action.length > 1000) {
        return res.status(400).json({ success: false, message: 'Invalid SOS payload' });
      }
      const optionalNumber = (value: unknown) => value === null || (typeof value === 'number' && Number.isFinite(value));
      if (!optionalNumber(people_involved) || !optionalNumber(latitude) || !optionalNumber(longitude) || !optionalNumber(location_accuracy)) {
        return res.status(400).json({ success: false, message: 'Invalid SOS numeric fields' });
      }
      const sosData = { user_id: req.user.userId, incident_type: incident_type.trim(), severity, people_involved, injury_reported, hazard_reported, ai_summary: summary.trim(), recommended_action: recommended_action.trim(), latitude, longitude, location_accuracy };

      const data = await sosModel.create(req.accessToken!, sosData);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getSOS(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });

      const data = await sosModel.getByUser(req.accessToken!, req.user.userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getSOSById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });

      const data = await sosModel.getById(req.accessToken!, req.params.id as string, req.user.userId);
      if (!data) return res.status(404).json({ success: false, message: 'SOS event not found' });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });

      const { status } = req.body;
      if (status !== 'ACTIVE' && status !== 'RESOLVED') return res.status(400).json({ success: false, message: 'Invalid SOS status' });

      const data = await sosModel.updateStatus(req.accessToken!, req.params.id as string, req.user.userId, status);
      if (!data) return res.status(404).json({ success: false, message: 'SOS event not found' });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
};
