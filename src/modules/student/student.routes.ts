import { Router } from 'express';
import { studentController } from './student.controller';
import { requireAuth, requireStudent } from '../../middleware/auth.middleware';

const router = Router();

// All routes require student authentication
router.get('/dashboard', requireAuth, requireStudent, studentController.getDashboard);
router.get('/bookings', requireAuth, studentController.getBookings);
router.patch('/bookings/:id/cancel', requireAuth, studentController.cancelBooking);
router.get('/profile', requireAuth, requireStudent, studentController.getProfile);
router.put('/profile', requireAuth, requireStudent, studentController.updateProfile);

export default router;