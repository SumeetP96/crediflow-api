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
import { ECustomerStatus, ICustomerContactNumber } from '../customers.types';

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
  @Column(DataType.ARRAY(DataType.JSONB))
  contactNumbers: ICustomerContactNumber[];

  @AllowNull
  @Column(DataType.ARRAY(DataType.JSONB))
  addresses: ICustomerContactNumber[];

  @Column
  isReseller: boolean;

  @Default(0)
  @Column(DataType.FLOAT)
  balance: number;

  @Default(0)
  @Column(DataType.FLOAT)
  openingBalance: number;

  @Default(ECustomerStatus.ACTIVE)
  @Column(DataType.ENUM(ECustomerStatus.ACTIVE, ECustomerStatus.IN_ACTIVE))
  status: ECustomerStatus;

  // Relations

  @BelongsTo(() => Customer, 'parentId')
  parent: Customer;

  @HasMany(() => Invoice)
  invoices: Invoice[];

  @HasMany(() => InvoiceRelation)
  invoiceRelations: InvoiceRelation[];
}
