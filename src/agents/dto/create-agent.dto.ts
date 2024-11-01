import { z } from 'zod';
import {
  EAgentAddressStatus,
  EAgentContactNumberStatus,
  EAgentStatus,
} from '../agents.types';

export const createAgentSchema = z.object({
  name: z.string().min(2).max(100),
  contactNumbers: z
    .array(
      z.object({
        // NOTE: Update in frontend too
        number: z.string().min(8).max(15).optional(),
        isPrimary: z.boolean(),
        status: z.enum([
          EAgentContactNumberStatus.ACTIVE,
          EAgentContactNumberStatus.IN_ACTIVE,
        ]),
      }),
    )
    .optional(),
  addresses: z
    .array(
      z.object({
        // NOTE: Update in frontend too
        address: z.string().optional(),
        isPrimary: z.boolean(),
        status: z.enum([
          EAgentAddressStatus.ACTIVE,
          EAgentAddressStatus.IN_ACTIVE,
        ]),
      }),
    )
    .optional(),
  status: z.enum([EAgentStatus.ACTIVE, EAgentStatus.IN_ACTIVE]),
  parentId: z.number().nullable().optional(),
});

export type CreateAgentDto = z.infer<typeof createAgentSchema>;
