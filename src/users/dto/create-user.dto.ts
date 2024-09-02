import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string(),
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    role: z.enum(['super_admin', 'admin', 'employee']),
    status: z.enum(['active', 'inactive', 'deleted']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type CreateUserDto = z.infer<typeof createUserSchema>;
