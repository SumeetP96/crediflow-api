import { Column, Model, Table } from 'sequelize-typescript';
import { UserRole, UserStatus } from './user.interfaces';

@Table({
  tableName: 'users',
})
export class User extends Model {
  @Column
  name: string;

  @Column
  username: string;

  @Column
  password: string;

  @Column
  role: UserRole;

  @Column({
    defaultValue: 'active',
  })
  status: UserStatus;

  @Column({
    defaultValue: null,
  })
  deletedAt: Date | null;
}
