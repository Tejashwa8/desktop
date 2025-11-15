import express from 'express';
import {
  searchFlights,
  getFlightById,
  getAllFlights,
  createFlight,
  updateFlight,
  deleteFlight,
} from '../controllers/flightController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/search', searchFlights);
router.get('/', getAllFlights);
router.get('/:id', getFlightById);
router.post('/', authenticateToken, isAdmin, createFlight);
router.put('/:id', authenticateToken, isAdmin, updateFlight);
router.delete('/:id', authenticateToken, isAdmin, deleteFlight);

export default router;
