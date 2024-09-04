import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { InvoiceCategoriesStatus } from '../invoice-categories.interfaces';

@Table({
  tableName: 'invoice_category',
  paranoid: true,
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

  @Column({
    type: DataType.ENUM(
      InvoiceCategoriesStatus.ACTIVE,
      InvoiceCategoriesStatus.IN_ACTIVE,
    ),
    defaultValue: InvoiceCategoriesStatus.ACTIVE,
  })
  status: InvoiceCategoriesStatus;

  @HasMany(() => Invoice)
  invoices: Invoice[];
}
