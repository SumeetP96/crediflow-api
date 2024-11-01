import { z } from 'zod';
import { EAgentStatus } from '../agents.types';

export const findAllAgentsSchema = z.object({
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
  parentName: z.string().optional().nullable(),
  contactNumbers: z.string().optional().nullable(),
  addresses: z.string().optional().nullable(),
  status: z
    .enum([EAgentStatus.ACTIVE, EAgentStatus.IN_ACTIVE])
    .optional()
    .nullable(),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
  deletedAt: z.string().optional().nullable(),
  isDeletedShown: z.enum(['yes', 'no']).optional().nullable(),
});

export type FindAllAgentsQuery = z.infer<typeof findAllAgentsSchema>;
