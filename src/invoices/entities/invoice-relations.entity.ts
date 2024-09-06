import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Agent } from 'src/agents/entities/agent.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Invoice } from './invoice.entity';

@Table({
  tableName: 'invoice_relations',
  indexes: [
    {
      unique: true,
      fields: ['invoiceId', 'customerId', 'agentId'],
    },
  ],
})
export class InvoiceRelation extends Model {
  @ForeignKey(() => Invoice)
  @Column
  invoiceId: number;

  @AllowNull
  @ForeignKey(() => Customer)
  @Column
  customerId: number;

  @AllowNull
  @ForeignKey(() => Agent)
  @Column
  agentId: number;

  @BelongsTo(() => Invoice, 'invoiceId')
  invoice: Invoice;

  @BelongsTo(() => Customer, 'customerId')
  customer: Customer;

  @BelongsTo(() => Agent, 'agentId')
  agent: Agent;
}
