import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  requestRefund,
  getAllBookings,
} from '../controllers/bookingController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, createBooking);
router.get('/my-bookings', authenticateToken, getUserBookings);
router.get('/all', authenticateToken, isAdmin, getAllBookings);
router.get('/:id', authenticateToken, getBookingById);
router.put('/:id/cancel', authenticateToken, cancelBooking);
router.put('/:id/refund', authenticateToken, requestRefund);

export default router;
