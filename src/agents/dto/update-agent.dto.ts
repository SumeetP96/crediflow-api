import {
  ECustomerAddressStatus,
  ECustomerContactNumberStatus,
} from 'src/customers/customers.types';
import { z } from 'zod';
import { EAgentStatus } from '../agents.types';

export const updateAgentSchema = z.object({
  name: z.string().min(2).max(100).optional().nullable(),
  contactNumbers: z
    .array(
      z.object({
        // NOTE: Update in frontend too
        number: z.string().min(8).max(15).optional(),
        isPrimary: z.boolean(),
        status: z.enum([
          ECustomerContactNumberStatus.ACTIVE,
          ECustomerContactNumberStatus.IN_ACTIVE,
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
          ECustomerAddressStatus.ACTIVE,
          ECustomerAddressStatus.IN_ACTIVE,
        ]),
      }),
    )
    .optional(),
  status: z
    .enum([EAgentStatus.ACTIVE, EAgentStatus.IN_ACTIVE])
    .optional()
    .nullable(),
  parentId: z.number().optional().nullable(),
});

export type UpdateAgentDto = z.infer<typeof updateAgentSchema>;
