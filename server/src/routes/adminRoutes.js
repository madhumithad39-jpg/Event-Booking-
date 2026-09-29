import { Router } from 'express';
import {
  getAdminStats,
  getAllBookings,
  getAllUsers,
  triggerReminders,
} from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/bookings', getAllBookings);
router.get('/users', getAllUsers);
router.post('/trigger-reminders', triggerReminders);

export default router;
