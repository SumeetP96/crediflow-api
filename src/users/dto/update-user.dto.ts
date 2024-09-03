import { z } from 'zod';
import { UserRole, UserStatus } from '../user.interfaces';

export const updateUserSchema = z
  .object({
    name: z.string().optional(),
    username: z.string().min(3).max(50).optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    role: z
      .enum([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EMPLOYEE])
      .optional(),
    status: z.enum([UserStatus.ACTIVE, UserStatus.IN_ACTIVE]).optional(),
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
