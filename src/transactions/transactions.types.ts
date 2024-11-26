export enum ETransactionStatus {
  COMPLETED = 'completed',
  PROCESSING = 'processing',
  ON_HOLD = 'on_hold',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum ETransactionTypeId {
  PAYMENT_ID = 1,
  DISCOUNT_ID = 2,
}
