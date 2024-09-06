import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { InvoiceCategoriesStatus } from '../invoice-categories.interfaces';

@Table({
  tableName: 'invoice_categories',
})
export class InvoiceCategory extends Model {
  @Column
  name: string;

  @AllowNull
  @Column
  prefix: string;

  @AllowNull
  @Column
  suffix: string;

  @AllowNull
  @Column
  description: string;

  @Default(false)
  @Column
  isAutoIncrement: boolean;

  @AllowNull
  @Column
  nextNumber: number;

  @Column({
    type: DataType.ENUM(
      InvoiceCategoriesStatus.ACTIVE,
      InvoiceCategoriesStatus.IN_ACTIVE,
    ),
    defaultValue: InvoiceCategoriesStatus.ACTIVE,
  })
  status: InvoiceCategoriesStatus;

  // Relations
  @HasMany(() => Invoice)
  invoices: Invoice[];
}
