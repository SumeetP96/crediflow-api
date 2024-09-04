import { z } from 'zod';
import { InvoiceCategoriesStatus } from '../invoice-categories.interfaces';

export const updateInvoiceCategorySchema = z
  .object({
    name: z.string().optional().nullable(),
    prefix: z.string().optional().nullable(),
    suffix: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    status: z
      .enum([InvoiceCategoriesStatus.ACTIVE, InvoiceCategoriesStatus.IN_ACTIVE])
      .optional()
      .nullable(),
  })
  .required();

export type UpdateInvoiceCategoryDto = z.infer<
  typeof updateInvoiceCategorySchema
>;
