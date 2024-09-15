import { z } from 'zod';
import { UserStatus } from '../user.interfaces';

export const findAllUsersSchema = z.object({
  page: z.string().transform((val) => parseInt(val, 10)),
  perPage: z.string().transform((val) => parseInt(val, 10)),
  sortBy: z.string().optional().nullable(),
  sortOrder: z.enum(['asc', 'desc', 'none']).optional().nullable(),
  search: z.string().optional().nullable(),
  roles: z.array(z.string()).optional().nullable(),
  status: z
    .enum(['all', UserStatus.ACTIVE, UserStatus.IN_ACTIVE])
    .optional()
    .nullable(),
});

export type FindAllUsersQuery = z.infer<typeof findAllUsersSchema>;
