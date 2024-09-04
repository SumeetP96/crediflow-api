import { z } from 'zod';

export const updateInvoiceSchema = z
  .object({
    date: z.string().optional().nullable(),
    invoiceCategoryId: z.number().int().positive().optional().nullable(),
    invoiceNumber: z
      .union([z.number().int().positive(), z.string()])
      .optional()
      .nullable(),
    customerId: z.number().int().positive().optional().nullable(),
    amount: z.number().optional().nullable(),
  })
  .required();

export type UpdateInvoiceDto = z.infer<typeof updateInvoiceSchema>;
