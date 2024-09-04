import { z } from 'zod';

export const updateTransactionTypeSchema = z.object({
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isDeduction: z.boolean().optional().nullable(),
});

export type UpdateTransactionTypeDto = z.infer<
  typeof updateTransactionTypeSchema
>;
