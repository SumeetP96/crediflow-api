import { z } from 'zod';

export const createInvoiceSchema = z
  .object({
    invoiceCategoryId: z.number().int().positive(),
    customerId: z.number().int().positive(),
    date: z.string(),
    invoiceNumber: z.union([z.number().int().positive(), z.string()]),
    amount: z.number(),
    dueDate: z.string().optional().nullable(),
    relatedCustomerIds: z
      .array(z.number().int().positive())
      .optional()
      .nullable(),
    relatedAgentIds: z.array(z.number().int().positive()).optional().nullable(),
  })
  .required();

export type CreateInvoiceDto = z.infer<typeof createInvoiceSchema>;
