import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
} from '../controllers/userController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.put('/change-password', authenticateToken, changePassword);
router.get('/all', authenticateToken, isAdmin, getAllUsers);

export default router;
