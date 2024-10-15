import { z } from 'zod';
import { EUserStatus } from '../user.types';

export const findAllUsersSchema = z.object({
  page: z.string().transform((val) => parseInt(val, 10)),
  perPage: z.string().transform((val) => parseInt(val, 10)),
  sortBy: z.string().optional().nullable(),
  sortOrder: z.enum(['asc', 'desc', 'none']).optional().nullable(),
  search: z.string().optional().nullable(),
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .optional()
    .nullable(),
  name: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  role: z.array(z.string()).optional().nullable(),
  status: z
    .enum([EUserStatus.ACTIVE, EUserStatus.IN_ACTIVE])
    .optional()
    .nullable(),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
  deletedAt: z.string().optional().nullable(),
  isDeletedShown: z.enum(['yes', 'no']).optional().nullable(),
});

export type FindAllUsersQuery = z.infer<typeof findAllUsersSchema>;
