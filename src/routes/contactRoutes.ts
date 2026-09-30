import { Router } from 'express';
import { contactController } from '../controllers/contactController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', contactController.getContacts);
router.post('/', contactController.addContact);
router.delete('/:id', contactController.deleteContact);

export default router;
