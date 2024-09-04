import { z } from 'zod';

export const createTransactionTypeSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  isSubtracted: z.boolean(),
});

export class CreateTransactionTypeDto {}
