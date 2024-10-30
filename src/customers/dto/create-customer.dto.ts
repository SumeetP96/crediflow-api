import { z } from 'zod';
import {
  ECustomerAddressStatus,
  ECustomerContactNumberStatus,
  ECustomerStatus,
} from '../customers.types';

export const createCustomerSchema = z
  .object({
    name: z.string().min(2).max(100),
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
    status: z.enum([ECustomerStatus.ACTIVE, ECustomerStatus.IN_ACTIVE]),
    parentId: z.number().optional().nullable(),
    openingBalance: z.number().optional().nullable(),
  })
  .required();

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
