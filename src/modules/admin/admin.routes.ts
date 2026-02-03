import { Router } from 'express';
import { adminController } from './admin.controller';
import { requireAuth, requireAdmin } from '../../middleware/auth.middleware';

const router = Router();

// All routes require admin authentication
router.get('/', requireAuth, requireAdmin, adminController.getDashboard);
router.get('/profile', requireAuth, requireAdmin, adminController.getProfile);
router.put('/profile', requireAuth, requireAdmin, adminController.updateProfile);
router.get('/users', requireAuth, requireAdmin, adminController.getUsers);
router.get('/bookings', requireAuth, requireAdmin, adminController.getBookings);
router.get('/categories', adminController.getCategories);
router.post('/categories', requireAuth, requireAdmin, adminController.createCategory);
router.put('/categories/:id', requireAuth, requireAdmin, adminController.updateCategory);
router.delete('/categories/:id', requireAuth, requireAdmin, adminController.deleteCategory);
router.patch('/users/:id/status', requireAuth, requireAdmin, adminController.updateUserStatus);

export default router;