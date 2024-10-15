import { z } from 'zod';
import { ECustomerStatus } from '../customers.types';

export const createCustomerSchema = z
  .object({
    name: z.string(),
    contactNumbers: z.array(z.string()).optional(),
    addresses: z.array(z.string()).optional(),
    status: z.enum([ECustomerStatus.ACTIVE, ECustomerStatus.IN_ACTIVE]),
    parentId: z.number().optional().nullable(),
    openingBalance: z.number().optional().nullable(),
  })
  .required();

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
