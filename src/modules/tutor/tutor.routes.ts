import { Router } from 'express';
import { tutorController } from './tutor.controller';
import { requireAuth, requireTutor } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, tutorController.getAllTutors);
router.post('/', requireAuth, tutorController.createProfile);
router.get('/:id', requireAuth, tutorController.getTutorById);
router.put('/profile', requireAuth, tutorController.updateProfile);
router.put('/availability', requireAuth, tutorController.updateAvailability);

export default router;