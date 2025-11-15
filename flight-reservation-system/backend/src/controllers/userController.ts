import { Request, Response } from 'express';
import { users } from '../data/mockData';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

export const getUserProfile = (req: AuthRequest, res: Response): void => {
  try {
    const user = users.find((u) => u.id === req.user!.id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUserProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, phone } = req.body;
    const userIndex = users.findIndex((u) => u.id === req.user!.id);

    if (userIndex === -1) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Update user
    if (firstName) users[userIndex].firstName = firstName;
    if (lastName) users[userIndex].lastName = lastName;
    if (phone) users[userIndex].phone = phone;

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        firstName: users[userIndex].firstName,
        lastName: users[userIndex].lastName,
        phone: users[userIndex].phone,
        role: users[userIndex].role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Both passwords are required' });
      return;
    }

    const userIndex = users.findIndex((u) => u.id === req.user!.id);

    if (userIndex === -1) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      users[userIndex].password
    );

    if (!isValidPassword) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllUsers = (req: Request, res: Response): void => {
  try {
    const usersWithoutPasswords = users.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      role: u.role,
      createdAt: u.createdAt,
    }));

    res.json({ users: usersWithoutPasswords });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
