import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Agent } from 'src/agents/entities/agent.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { InvoiceCategory } from 'src/invoice-categories/entities/invoice-category.entity';

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

  @ForeignKey(() => Customer)
  @Column
  coCustomerId: number;

  @ForeignKey(() => Agent)
  @Column
  coAgentId: number;

  @BelongsTo(() => InvoiceCategory, 'invoiceCategoryId')
  invoiceCategory: InvoiceCategory;

  @BelongsTo(() => Customer, 'customerId')
  customer: Customer;

  @BelongsTo(() => Customer, 'coCustomerId')
  coCustomer: Customer;

  @BelongsTo(() => Agent, 'coAgentId')
  agent: Agent;
}
