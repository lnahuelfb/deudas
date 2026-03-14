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

    console.log('User logged in successfully:', token);

    return res.status(200).json(token);
  } catch (err) {
    console.error('Error occurred while logging in:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const registerData = authSchema.AuthRegisterSchema.safeParse(req.body);
    console.log('Register request body:', registerData);

    
    if(!registerData.success) {
      return res.status(400).json({ 
        error: 'Invalid registration data',
        details: registerData.error 
      });
    }
    const newUser = await authService.registerUser(registerData.data);

    console.log('New user registered:', newUser);

    return res.status(201).json(newUser);
  } catch (err) {
    console.error('Error occurred while registering user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
