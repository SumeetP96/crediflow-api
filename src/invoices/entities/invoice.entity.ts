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

  @Default(0)
  @Column(DataType.FLOAT)
  amount: number;

  @Default(0)
  @Column(DataType.FLOAT)
  balance: number;

  // Reations
  @BelongsTo(() => InvoiceCategory, 'invoiceCategoryId')
  invoiceCategory: InvoiceCategory;

  @BelongsTo(() => Customer, 'customerId')
  customer: Customer;

  @HasMany(() => Transaction)
  transactions: Transaction[];

  @HasMany(() => InvoiceRelation)
  invoiceRelations: InvoiceRelation[];
}
