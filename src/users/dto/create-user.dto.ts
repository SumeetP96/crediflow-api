import { z } from 'zod';

export const createUserDto = z
  .object({
    name: z.string(),
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    role: z.enum(['super_admin', 'admin', 'employee']),
    status: z.enum(['active', 'inactive', 'deleted']),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserDto>;
