import { z } from 'zod';
import { AgentsStatus } from '../agents.interfaces';

export const createAgentSchema = z.object({
  name: z.string(),
  contactNumbers: z.array(z.string()).optional(),
  addresses: z.array(z.string()).optional(),
  status: z.enum([AgentsStatus.ACTIVE, AgentsStatus.IN_ACTIVE]),
  parentId: z.number().nullable().optional(),
});

export type CreateAgentDto = z.infer<typeof createAgentSchema>;
