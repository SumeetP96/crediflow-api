import { z } from 'zod';
import { EAgentStatus } from '../agents.types';

export const createAgentSchema = z.object({
  name: z.string(),
  contactNumbers: z.array(z.string()).optional(),
  addresses: z.array(z.string()).optional(),
  status: z.enum([EAgentStatus.ACTIVE, EAgentStatus.IN_ACTIVE]),
  parentId: z.number().nullable().optional(),
});

export type CreateAgentDto = z.infer<typeof createAgentSchema>;
