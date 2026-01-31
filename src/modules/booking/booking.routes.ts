import { Router } from 'express';
import { bookingController } from './booking.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

// All booking routes require authentication
router.post('/', requireAuth, bookingController.createBooking);
router.get('/', requireAuth, bookingController.getUserBookings);
router.get('/:id', requireAuth, bookingController.getBookingById);

export default router;