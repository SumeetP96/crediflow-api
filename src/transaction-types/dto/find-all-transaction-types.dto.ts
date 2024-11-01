import { z } from 'zod';
import { ETransactionTypeStatus } from '../transaction-types.interfaces';

export const findAllTransactionTypesSchema = z.object({
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
  prefix: z.string().optional().nullable(),
  suffix: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isAutoIncrement: z.enum(['yes', 'no']).optional().nullable(),
  status: z
    .enum([ETransactionTypeStatus.ACTIVE, ETransactionTypeStatus.IN_ACTIVE])
    .optional()
    .nullable(),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
});

export type FindAllTransactionTypesQuery = z.infer<
  typeof findAllTransactionTypesSchema
>;
