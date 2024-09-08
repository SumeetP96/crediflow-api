import { z } from 'zod';

export const updateInvoiceSchema = z
  .object({
    invoiceCategoryId: z.number().int().positive().optional().nullable(),
    customerId: z.number().int().positive().optional().nullable(),
    date: z.string().optional().nullable(),
    invoiceNumber: z
      .union([z.number().int().positive(), z.string()])
      .optional()
      .nullable(),
    amount: z.number().optional().nullable(),
    dueDate: z.string().optional().nullable(),
    relatedCustomerIds: z
      .array(z.number().int().positive())
      .optional()
      .nullable(),
    relatedAgentIds: z.array(z.number().int().positive()).optional().nullable(),
  })
  .required();

export type UpdateInvoiceDto = z.infer<typeof updateInvoiceSchema>;
