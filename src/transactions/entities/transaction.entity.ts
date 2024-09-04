import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Customer } from 'src/customers/entities/customer.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { TransactionType } from 'src/transaction-types/entities/transaction-type.entity';

@Table({
  tableName: 'transactions',
})
export class Transaction extends Model {
  @Column
  date: Date;

  @ForeignKey(() => TransactionType)
  transactionTypeId: number;

  @ForeignKey(() => Invoice)
  invoiceId: number;

  @ForeignKey(() => Customer)
  customerId: number;

  @Column(DataType.FLOAT)
  amount: number;

  @Column
  displayIndex: number;

  @Column
  isFromInvoice: boolean;

  @AllowNull
  @Column(DataType.TEXT)
  remarks: string;

  @BelongsTo(() => TransactionType, 'transactionTypeId')
  transactionType: TransactionType;

  @BelongsTo(() => Invoice, 'invoiceId')
  invoice: Invoice;

  @BelongsTo(() => Customer, 'customerId')
  customer: Customer;
}
