import { Router } from 'express';
import { TutorController } from './tutor.controller';

const router = Router();

router.get('/', TutorController.getAllTutors);
router.get('/:id', TutorController.getTutorById);
router.post('/profile', TutorController.createProfile);

export default router;