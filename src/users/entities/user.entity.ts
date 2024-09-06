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
import { UserRole, UserStatus } from '../user.interfaces';

@Table({
  tableName: 'users',
  paranoid: true,
})
export class User extends Model {
  @Column
  name: string;

  @Column
  username: string;

  @Column(DataType.STRING)
  password: string;

  @Column(
    DataType.ENUM(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EMPLOYEE),
  )
  role: UserRole;

  @Default(UserStatus.ACTIVE)
  @Column(DataType.ENUM(UserStatus.ACTIVE, UserStatus.IN_ACTIVE))
  status: UserStatus;

  // Relations

  @HasMany(() => Invoice)
  invoices: Invoice[];

  @HasMany(() => Transaction)
  transactions: Transaction[];
}
