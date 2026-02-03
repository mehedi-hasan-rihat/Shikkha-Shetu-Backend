import { Router } from 'express';
import { tutorController } from './tutor.controller';
import { requireAuth, requireTutor } from '../../middleware/auth.middleware';

const router = Router();

// Protected routes (specific routes first)
router.get('/profile', requireAuth, requireTutor, tutorController.getProfile);
router.put('/profile', requireAuth, requireTutor, tutorController.updateProfile);
router.get('/availability', requireAuth, requireTutor, tutorController.getAvailability);
router.post('/availability', requireAuth, requireTutor, tutorController.addAvailability);
router.put('/availability', requireAuth, requireTutor, tutorController.updateAvailability);
router.delete('/availability/:id', requireAuth, requireTutor, tutorController.deleteAvailability);
router.post('/', requireAuth, tutorController.createProfile);

// Public routes
router.get('/', tutorController.getAllTutors);
router.get('/:id', tutorController.getTutorById);

export default router;