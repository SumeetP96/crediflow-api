import { z } from 'zod';
import {
  ECustomerAddressStatus,
  ECustomerContactNumberStatus,
  ECustomerStatus,
} from '../customers.types';

export const updateCustomerSchema = z
  .object({
    name: z.string().optional().nullable(),
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
      .optional()
      .nullable(),
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
      .optional()
      .nullable(),
    status: z
      .enum([ECustomerStatus.ACTIVE, ECustomerStatus.IN_ACTIVE])
      .optional()
      .nullable(),
    parentId: z.number().optional().nullable(),
    openingBalance: z.number().optional().nullable(),
  })
  .required();

export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>;
