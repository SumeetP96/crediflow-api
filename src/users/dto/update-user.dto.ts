import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z.string().optional(),
    username: z.string().min(3).max(50).optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    role: z.enum(['super-admin', 'admin', 'employee']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  })
  .refine(
    (data) => {
      if (
        data.password &&
        (!data.confirmPassword || data.password !== data.confirmPassword)
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Password and Confirm Password do not match',
      path: ['confirmPassword'],
    },
  );

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
