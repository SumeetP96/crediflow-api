import { z } from 'zod';

export const createInvoiceSchema = z
  .object({
    date: z.string(),
    invoiceCategoryId: z.number().int().positive(),
    invoiceNumber: z.union([z.number().int().positive(), z.string()]),
    customerId: z.number().int().positive(),
    amount: z.number(),
  })
  .required();

export type CreateInvoiceDto = z.infer<typeof createInvoiceSchema>;
