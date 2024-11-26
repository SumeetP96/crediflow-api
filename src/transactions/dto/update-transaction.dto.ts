import { z } from 'zod';
import { ETransactionStatus } from '../transactions.types';

export const updateTransactionSchema = z
  .object({
    transactionTypeId: z.number(),
    invoiceId: z.number(),
    date: z.string(),
    amount: z.number(),
    remarks: z.string().optional().nullable(),
    status: z.enum([
      ETransactionStatus.COMPLETED,
      ETransactionStatus.PROCESSING,
      ETransactionStatus.ON_HOLD,
      ETransactionStatus.FAILED,
      ETransactionStatus.CANCELLED,
    ]),
  })
  .required();

export type UpdateTransactionDto = z.infer<typeof updateTransactionSchema>;
