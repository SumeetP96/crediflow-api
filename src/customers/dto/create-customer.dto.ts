import { z } from 'zod';
import { CustomerStatus } from '../customers.types';

export const createCustomerSchema = z
  .object({
    name: z.string(),
    contactNumbers: z.array(z.string()).optional(),
    addresses: z.array(z.string()).optional(),
    status: z.enum([CustomerStatus.ACTIVE, CustomerStatus.IN_ACTIVE]),
    parentId: z.number().optional().nullable(),
    openingBalance: z.number().optional().nullable(),
  })
  .required();

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
