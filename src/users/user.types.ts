import { User } from './entities/user.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

export enum EUserStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'in_active',
}

export interface ITransformedUser extends Partial<User> {
  id: number;
  name: string;
  username: string;
  role: UserRole;
  status: EUserStatus;
  createdAt: Date;
  updatedAt: Date;
}
