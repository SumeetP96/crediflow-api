import { z } from 'zod';
import { EUserStatus, UserRole } from '../user.types';

export const createUserSchema = z
  .object({
    name: z.string().min(2).max(100),
    username: z.string().min(4).max(20),
    password: z.string().min(6).max(40),
    confirmPassword: z.string().min(6).max(100),
    role: z.enum([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EMPLOYEE]),
    status: z.enum([EUserStatus.ACTIVE, EUserStatus.IN_ACTIVE]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type CreateUserDto = z.infer<typeof createUserSchema>;
