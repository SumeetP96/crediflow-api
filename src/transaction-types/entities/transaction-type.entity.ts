import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { ETransactionTypeStatus } from '../transaction-types.interfaces';

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
  isDeduction: boolean;

  @Default(ETransactionTypeStatus.ACTIVE)
  @Column(
    DataType.ENUM(
      ETransactionTypeStatus.ACTIVE,
      ETransactionTypeStatus.IN_ACTIVE,
    ),
  )
  status: ETransactionTypeStatus;

  // Relations

  @HasMany(() => Transaction)
  transactions: Transaction[];
}
