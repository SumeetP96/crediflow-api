import { z } from 'zod';
import { EAgentStatus } from '../agents.types';

export const updateAgentSchema = z.object({
  name: z.string().optional().nullable(),
  contactNumbers: z.array(z.string()).optional().nullable(),
  addresses: z.array(z.string()).optional().nullable(),
  status: z
    .enum([EAgentStatus.ACTIVE, EAgentStatus.IN_ACTIVE])
    .optional()
    .nullable(),
  parentId: z.number().optional().nullable(),
});

export type UpdateAgentDto = z.infer<typeof updateAgentSchema>;
