import { Router } from 'express';
import { adminController } from './admin.controller';
import { requireAuth, requireAdmin } from '../../middleware/auth.middleware';

const router = Router();

// All routes require admin authentication
router.get('/', requireAuth, requireAdmin, adminController.getDashboard);
router.get('/users', requireAuth, requireAdmin, adminController.getUsers);
router.patch('/users/:id', requireAuth, requireAdmin, adminController.updateUserStatus);
router.get('/bookings', requireAuth, requireAdmin, adminController.getBookings);
router.get('/categories', adminController.getCategories);
router.post('/categories', requireAuth, adminController.createCategory);

export default router;