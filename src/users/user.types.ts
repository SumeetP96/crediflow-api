import { User } from './entities/user.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

export enum UserStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'in_active',
}

export interface ITransformedUser extends Partial<User> {
  id: number;
  name: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
