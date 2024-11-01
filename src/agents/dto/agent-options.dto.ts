import { z } from 'zod';

export const agentOptionsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .optional()
    .nullable(),
});

export type AgentOptionsQuery = z.infer<typeof agentOptionsSchema>;
