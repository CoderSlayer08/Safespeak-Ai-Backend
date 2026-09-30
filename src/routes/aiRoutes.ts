import { Router } from 'express';
import multer from 'multer';
import { aiController } from '../controllers/aiController';
import { authMiddleware } from '../middleware/authMiddleware';
import { aiRateLimit } from '../middleware/aiRateLimit';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

router.post('/analyze', authMiddleware, aiRateLimit, aiController.analyzeText);
router.post('/analyze-image', authMiddleware, aiRateLimit, upload.single('image'), aiController.analyzeImage);

export default router;
