import {
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
import { InvoiceStatus } from '../invoices.interfaces';
import { InvoiceRelation } from './invoice-relations.entity';

@Table({
  tableName: 'invoices',
})
export class Invoice extends Model {
  @Column
  date: Date;

  @ForeignKey(() => InvoiceCategory)
  @Column
  invoiceCategoryId: number;

  @Column
  invoiceNumber: string;

  @ForeignKey(() => Customer)
  @Column
  customerId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Default(0)
  @Column(DataType.FLOAT)
  amount: number;

  @Default(0)
  @Column(DataType.FLOAT)
  balance: number;

  @Column
  dueDate: Date;

  @Column({
    type: DataType.ENUM(
      InvoiceStatus.PAID,
      InvoiceStatus.UNPAID,
      InvoiceStatus.ON_HOLD,
      InvoiceStatus.CANCELLED,
    ),
    defaultValue: InvoiceStatus.UNPAID,
  })
  status: InvoiceStatus;

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
