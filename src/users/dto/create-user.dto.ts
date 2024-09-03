import { z } from 'zod';
import { UserRole, UserStatus } from '../user.interfaces';

export const createUserSchema = z
  .object({
    name: z.string(),
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    role: z.enum([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EMPLOYEE]),
    status: z.enum([UserStatus.ACTIVE, UserStatus.IN_ACTIVE]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type CreateUserDto = z.infer<typeof createUserSchema>;
