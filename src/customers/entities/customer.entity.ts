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
import { InvoiceRelation } from 'src/invoices/entities/invoice-relations.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { CustomerStatus } from '../customers.interfaces';

@Table({
  tableName: 'customers',
  paranoid: true,
})
export class Customer extends Model {
  @AllowNull
  @ForeignKey(() => Customer)
  @Column
  parentId: number;

  @Column
  name: string;

  @AllowNull
  @Column(DataType.ARRAY(DataType.STRING))
  contactNumbers: string[];

  @AllowNull
  @Column(DataType.ARRAY(DataType.TEXT))
  addresses: string[];

  @Column
  isReseller: boolean;

  @Default(0)
  @Column(DataType.FLOAT)
  balance: number;

  @Column({
    type: DataType.ENUM(CustomerStatus.ACTIVE, CustomerStatus.IN_ACTIVE),
    defaultValue: CustomerStatus.ACTIVE,
  })
  status: CustomerStatus;

  @BelongsTo(() => Customer, 'parentId')
  parent: Customer;

  @HasMany(() => Invoice)
  invoices: Invoice[];

  @HasMany(() => InvoiceRelation)
  invoiceRelations: InvoiceRelation[];
}
