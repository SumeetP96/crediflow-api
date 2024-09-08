import { z } from 'zod';
import { TransactionStatus } from '../transactions.interfaces';

export const updateTransactionSchema = z
  .object({
    transactionTypeId: z.number(),
    invoiceId: z.number(),
    date: z.string(),
    amount: z.number(),
    remarks: z.string().optional().nullable(),
    status: z.enum([
      TransactionStatus.COMPLETED,
      TransactionStatus.PROCESSING,
      TransactionStatus.ON_HOLD,
      TransactionStatus.FAILED,
      TransactionStatus.CANCELLED,
    ]),
  })
  .required();

export type UpdateTransactionDto = z.infer<typeof updateTransactionSchema>;
