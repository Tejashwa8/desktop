import express from 'express';
import { getAnalytics, getRecentBookings } from '../controllers/adminController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/analytics', authenticateToken, isAdmin, getAnalytics);
router.get('/recent-bookings', authenticateToken, isAdmin, getRecentBookings);

export default router;
