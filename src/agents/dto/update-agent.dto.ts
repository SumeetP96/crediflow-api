import { z } from 'zod';
import { AgentsStatus } from '../agents.interfaces';

export const updateAgentSchema = z.object({
  name: z.string().optional().nullable(),
  contactNumbers: z.array(z.string()).optional().nullable(),
  addresses: z.array(z.string()).optional().nullable(),
  status: z
    .enum([AgentsStatus.ACTIVE, AgentsStatus.IN_ACTIVE])
    .optional()
    .nullable(),
  parentId: z.number().optional().nullable(),
});

export type UpdateAgentDto = z.infer<typeof updateAgentSchema>;
