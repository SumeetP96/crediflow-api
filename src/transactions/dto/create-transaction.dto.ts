import { z } from 'zod';
import { ETransactionStatus } from '../transactions.types';

export const createTransactionSchema = z
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

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
