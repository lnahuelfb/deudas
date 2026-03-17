import * as authSchema from './auth.schema';
import * as authService from './auth.service';
import { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
  try {
    const loginData = authSchema.AuthLoginSchema.safeParse(req.body);

    if (!loginData.success) {
      return res.status(400).json({
        error: 'Invalid login data',
        details: loginData.error
      });
    }

    const data = await authService.loginUser(loginData.data);

    res.cookie("token", data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60
    })

    return res.status(200).json(data);
  } catch (err) {
    console.error('Error occurred while logging in:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Error occurred while logging out:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const registerData = authSchema.AuthRegisterSchema.safeParse(req.body);

    if (!registerData.success) {
      return res.status(400).json({
        error: 'Invalid registration data',
        details: registerData.error
      });
    }
    const newUser = await authService.registerUser(registerData.data);

    return res.status(201).json(newUser);
  } catch (err) {
    console.error('Error occurred while registering user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const user = await authService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (err) {
    console.error('Error occurred while fetching user data:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

