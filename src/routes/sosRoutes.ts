import { Router } from 'express';
import { sosController } from '../controllers/sosController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', sosController.createSOS);
router.get('/', sosController.getSOS);
router.get('/:id', sosController.getSOSById);
router.patch('/:id/status', sosController.updateStatus);

export default router;
