import { z } from 'zod';
import { CustomerStatus } from '../customers.interfaces';

export const createCustomerSchema = z
  .object({
    name: z.string(),
    contactNumbers: z.array(z.string()).optional(),
    addresses: z.array(z.string()).optional(),
    status: z.enum([CustomerStatus.ACTIVE, CustomerStatus.IN_ACTIVE]),
    parentId: z.number().nullable().optional(),
    balance: z.number().nullable().optional(),
  })
  .required();

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
