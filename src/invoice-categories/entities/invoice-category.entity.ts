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
import { EInvoiceCategoryStatus } from '../invoice-categories.types';

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

  @Default(EInvoiceCategoryStatus.ACTIVE)
  @Column(
    DataType.ENUM(
      EInvoiceCategoryStatus.ACTIVE,
      EInvoiceCategoryStatus.IN_ACTIVE,
    ),
  )
  status: EInvoiceCategoryStatus;

  // Relations

  @HasMany(() => Invoice)
  invoices: Invoice[];
}
