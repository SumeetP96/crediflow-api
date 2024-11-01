import { findAllSchema } from 'src/common/find-all-schema';
import { z } from 'zod';
import { EInvoiceStatus } from '../invoices.types';

export const findAllInvoicesSchema = findAllSchema.extend({
  status: z
    .enum([
      EInvoiceStatus.PAID,
      EInvoiceStatus.PARTIAL_PAID,
      EInvoiceStatus.UNPAID,
      EInvoiceStatus.ON_HOLD,
      EInvoiceStatus.CANCELLED,
    ])
    .optional()
    .nullable(),
});

export type FindAllInvoicesSchema = z.infer<typeof findAllInvoicesSchema>;
