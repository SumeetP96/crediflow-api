import { z } from 'zod';
import { CustomerStatus } from '../customers.interfaces';

export const updateCustomerSchema = z
  .object({
    name: z.string().optional().nullable(),
    contactNumbers: z.array(z.string()).optional().nullable(),
    addresses: z.array(z.string()).optional().nullable(),
    status: z
      .enum([CustomerStatus.ACTIVE, CustomerStatus.IN_ACTIVE])
      .optional()
      .nullable(),
    parentId: z.number().optional().nullable(),
    balance: z.number().optional().nullable(),
  })
  .required();

export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>;
