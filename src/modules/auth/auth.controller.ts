import * as authSchema from './auth.schema';
import * as authService from './auth.service';
import { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
  try {
    const loginData = authSchema.AuthLoginSchema.safeParse(req.body);

    if(!loginData.success) {
      return res.status(400).json({ 
        error: 'Invalid login data',
        details: loginData.error 
      });
    }
    const token = await authService.loginUser(loginData.data);

    return res.status(200).json(token);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const registerData = authSchema.AuthRegisterSchema.safeParse(req.body);
    
    if(!registerData.success) {
      return res.status(400).json({ 
        error: 'Invalid registration data',
        details: registerData.error 
      });
    }
    const newUser = await authService.registerUser(registerData.data);

    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if(!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    await authService.logoutUser(token);

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
