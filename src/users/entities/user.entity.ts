import { Column, DataType, Default, Model, Table } from 'sequelize-typescript';
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
}
