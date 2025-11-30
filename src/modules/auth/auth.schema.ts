import {z} from 'zod';
import { UserLoginSchema, UserRegisterSchema } from '../user/user.schema';

export const AuthRegisterSchema = UserRegisterSchema;

export const AuthLoginSchema = UserLoginSchema;

export const AuthRefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const AuthLogoutSchema = AuthRefreshTokenSchema