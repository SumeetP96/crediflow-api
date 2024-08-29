import { Column, Model, Table } from 'sequelize-typescript';

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
  role: 'admin' | 'user';

  @Column({
    defaultValue: 'active',
  })
  status: 'active' | 'inactive';
}
