import * as userSchema from './user.schema';
import * as userService from './user.service';
import { Request, Response } from 'express';

// Helper para extraer el ID de forma segura
const getUserIdFromRequest = (req: Request): string | null => {
  if (!req.user || typeof req.user === 'string' || !req.user.userId) {
    return null;
  }
  return req.user.userId.toString();
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await userService.findUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userData = userSchema.UserUpdateSchema.safeParse(req.body);
    if (!userData.success) {
      return res.status(400).json({ error: 'Invalid user data', details: userData.error });
    }

    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updatedUser = await userService.updateUser(userId, userData.data);
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    const { password, ...userWithoutPassword } = updatedUser;
    return res.status(200).json(userWithoutPassword);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
