import * as z from 'zod';

export const UserRegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(6).max(100),
})

export const UserLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
})

export const UserUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.email().optional(),
  password: z.string().min(6).max(100).optional(),
})

export const UserIdParamSchema = z.object({
  id: z.cuid(),
})