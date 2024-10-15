import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { EUserStatus, UserRole } from '../user.types';

@Table({
  tableName: 'users',
  paranoid: true,
})
export class User extends Model {
  @Column
  name: string;

  @Column
  username: string;

  @Column
  password: string;

  @Column(
    DataType.ENUM(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EMPLOYEE),
  )
  role: UserRole;

  @Default(EUserStatus.ACTIVE)
  @Column(DataType.ENUM(EUserStatus.ACTIVE, EUserStatus.IN_ACTIVE))
  status: EUserStatus;

  // Relations

  @HasMany(() => Invoice)
  invoices: Invoice[];

  @HasMany(() => Transaction)
  transactions: Transaction[];
}
