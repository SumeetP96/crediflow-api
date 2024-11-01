import { z } from 'zod';

export const customerOptionsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .optional()
    .nullable(),
});

export type CustomerOptionsQuery = z.infer<typeof customerOptionsSchema>;
