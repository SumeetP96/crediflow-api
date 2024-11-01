import { z } from 'zod';
import { EInvoiceCategoryStatus } from '../invoice-categories.types';

export const updateInvoiceCategorySchema = z
  .object({
    name: z.string().optional().nullable(),
    prefix: z.string().max(10).optional().nullable(),
    suffix: z.string().max(10).optional().nullable(),
    description: z.string().optional().nullable(),
    status: z
      .enum([EInvoiceCategoryStatus.ACTIVE, EInvoiceCategoryStatus.IN_ACTIVE])
      .optional()
      .nullable(),
  })
  .required();

export type UpdateInvoiceCategoryDto = z.infer<
  typeof updateInvoiceCategorySchema
>;
