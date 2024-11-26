export enum EInvoiceStatus {
  PAID = 'paid',
  PARTIAL_PAID = 'partial_paid',
  UNPAID = 'unpaid',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
}

export interface IInvoiceItem {
  name: string;
  quantity: number;
  price: number;
  amount: number;
}
