import { z } from 'zod';
import { InvoiceCategoriesStatus } from '../invoice-categories.interfaces';

export const createInvoiceCategorySchema = z
  .object({
    name: z.string(),
    prefix: z.string().optional().nullable(),
    suffix: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    status: z.enum([
      InvoiceCategoriesStatus.ACTIVE,
      InvoiceCategoriesStatus.IN_ACTIVE,
    ]),
  })
  .required();

export type CreateInvoiceCategoryDto = z.infer<
  typeof createInvoiceCategorySchema
>;
