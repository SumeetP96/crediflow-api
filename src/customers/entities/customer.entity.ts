import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CustomerStatus } from '../customers.interfaces';

@Table({
  tableName: 'customers',
  paranoid: true,
})
export class Customer extends Model {
  @Column
  name: string;

  @AllowNull
  @Column(DataType.ARRAY(DataType.STRING))
  contactNumbers: string[];

  @AllowNull
  @Column(DataType.ARRAY(DataType.TEXT))
  addresses: string[];

  @AllowNull
  @Default(0)
  @Column(DataType.FLOAT)
  balance: number;

  @AllowNull
  @Column(DataType.ENUM(CustomerStatus.ACTIVE, CustomerStatus.IN_ACTIVE))
  status: CustomerStatus;

  @AllowNull
  @ForeignKey(() => Customer)
  @Column
  parentId: number;

  @BelongsTo(() => Customer, 'parentId')
  parent: Customer;
}
