import {
  AllowNull,
  BelongsTo,
  Column,
  Model,
  Table,
} from 'sequelize-typescript';
import { Invoice } from 'src/invoices/entities/invoice.entity';

@Table({
  tableName: 'transaction_types',
})
export class TransactionType extends Model {
  @Column
  name: string;

  @AllowNull
  @Column
  description: string;

  @Column
  isSubtracted: boolean;

  @BelongsTo(() => Invoice, 'invoiceId')
  invoice: Invoice;
}
