import { Router } from 'express';
import { reviewController } from './review.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, reviewController.createReview);
router.get('/tutor/:tutorId', reviewController.getTutorReviews);
router.get('/booking/:bookingId', requireAuth, reviewController.getBookingReview);

export default router;