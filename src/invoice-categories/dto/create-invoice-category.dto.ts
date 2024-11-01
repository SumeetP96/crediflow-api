import { z } from 'zod';
import { EInvoiceCategoryStatus } from '../invoice-categories.types';

export const createInvoiceCategorySchema = z
  .object({
    name: z.string(),
    prefix: z.string().max(10).optional().nullable(),
    suffix: z.string().max(10).optional().nullable(),
    description: z.string().optional().nullable(),
    status: z.enum([
      EInvoiceCategoryStatus.ACTIVE,
      EInvoiceCategoryStatus.IN_ACTIVE,
    ]),
  })
  .required();

export type CreateInvoiceCategoryDto = z.infer<
  typeof createInvoiceCategorySchema
>;
