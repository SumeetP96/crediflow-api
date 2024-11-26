import { z } from 'zod';

export const createInvoiceSchema = z
  .object({
    invoiceCategoryId: z.number().int().positive(),
    customerId: z.number().int().positive(),
    date: z.string(),
    invoiceNumber: z.union([z.number().int().positive(), z.string()]),
    amount: z.number(),
    dueDate: z.string().optional().nullable(),
    customerRelationIds: z
      .array(z.number().int().positive())
      .optional()
      .nullable(),
    agentRelationIds: z
      .array(z.number().int().positive())
      .optional()
      .nullable(),
    invoiceItems: z.array(
      z.object({
        name: z.string().max(50),
        quantity: z.number().positive(),
        price: z.number().positive(),
        amount: z.number().positive(),
      }),
    ),
    discount: z.number().positive('Should be greater than 0').safe(),
    payment: z.number().positive('Should be greater than 0').safe(),
  })
  .required();

export type CreateInvoiceDto = z.infer<typeof createInvoiceSchema>;
