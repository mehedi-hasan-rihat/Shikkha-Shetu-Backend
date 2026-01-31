import { Router } from 'express';
import { tutorController } from './tutor.controller';
import { requireAuth, requireTutor } from '../../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', tutorController.getAllTutors);
router.get('/:id', tutorController.getTutorById);

// Protected routes
router.post('/', requireAuth, tutorController.createProfile);
router.put('/profile', requireAuth, requireTutor, tutorController.updateProfile);
router.put('/availability', requireAuth, requireTutor, tutorController.updateAvailability);

export default router;