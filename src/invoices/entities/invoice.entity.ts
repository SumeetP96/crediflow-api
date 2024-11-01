import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Customer } from 'src/customers/entities/customer.entity';
import { InvoiceCategory } from 'src/invoice-categories/entities/invoice-category.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { EInvoiceStatus } from '../invoices.types';
import { InvoiceRelation } from './invoice-relations.entity';

@Table({
  tableName: 'invoices',
})
export class Invoice extends Model {
  @ForeignKey(() => InvoiceCategory)
  @Column
  invoiceCategoryId: number;

  @ForeignKey(() => Customer)
  @Column
  customerId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  date: Date;

  @Column
  invoiceNumber: string;

  @Default(0)
  @Column(DataType.FLOAT)
  amount: number;

  @Default(0)
  @Column(DataType.FLOAT)
  balance: number;

  @AllowNull
  @Column
  dueDate: Date;

  @Default(EInvoiceStatus.UNPAID)
  @Column(
    DataType.ENUM(
      EInvoiceStatus.PAID,
      EInvoiceStatus.UNPAID,
      EInvoiceStatus.ON_HOLD,
      EInvoiceStatus.CANCELLED,
    ),
  )
  status: EInvoiceStatus;

  // Reations
  @BelongsTo(() => InvoiceCategory, 'invoiceCategoryId')
  invoiceCategory: InvoiceCategory;

  @BelongsTo(() => Customer, 'customerId')
  customer: Customer;

  @BelongsTo(() => User, 'userId')
  user: User;

  @HasMany(() => Transaction)
  transactions: Transaction[];

  @HasMany(() => InvoiceRelation)
  invoiceRelations: InvoiceRelation[];
}
