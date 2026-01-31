import * as userSchema from './user.schema';
import * as userService from './user.service';
import { Request, Response } from 'express';

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = userSchema.UserIdParamSchema.safeParse(req.params.id);
    if (!userId.success) {
      return res.status(400).json({ error: 'Invalid user ID', details: userId.error });
    }

    const user = await userService.findUserById(userId.data.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json(user);
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

    if(!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user.id;
    const updatedUser = await userService.updateUser(userId, userData.data);

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
