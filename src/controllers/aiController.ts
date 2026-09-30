import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/aiService';

export const aiController = {
  async analyzeText(req: Request, res: Response, next: NextFunction) {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ success: false, message: 'Text is required' });
      }

      const data = await aiService.analyzeEmergency(text);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async analyzeImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Image is required' });
      }

      // Convert buffer to base64
      const base64Data = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;

      const data = await aiService.analyzeImage(mimeType, base64Data);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
};
