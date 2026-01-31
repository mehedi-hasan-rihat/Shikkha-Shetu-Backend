import { Router } from 'express';
import { tutorController } from './tutor.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, tutorController.getAllTutors);
router.post('/', requireAuth, tutorController.createProfile);
router.get('/:id', requireAuth, tutorController.getTutorById);

export default router;