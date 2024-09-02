import { z } from 'zod';

export const updateUserDto = z
  .object({
    name: z.string(),
    username: z.string().min(3).max(50),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    role: z.enum(['admin', 'employee']),
    status: z.enum(['active', 'inactive']),
  })
  .refine((data) => {
    if (data.password && !data.confirmPassword) {
      return 'Confirm Password is required when Password is present';
    }
    if (
      data.password &&
      data.confirmPassword &&
      data.password !== data.confirmPassword
    ) {
      return 'Password and Confirm Password do not match';
    }
    return true;
  }, 'Password and Confirm Password do not match');

export type UpdateUserDto = z.infer<typeof updateUserDto>;
