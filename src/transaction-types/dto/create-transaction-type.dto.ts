import { z } from 'zod';

export const createTransactionTypeSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  isDeduction: z.boolean(),
});

export type CreateTransactionTypeDto = z.infer<
  typeof createTransactionTypeSchema
>;
