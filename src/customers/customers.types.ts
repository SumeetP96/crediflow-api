import { Customer } from './entities/customer.entity';

export enum CustomerStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'in_active',
}

export type TCustomerOption = Pick<Customer, 'id' | 'name'>;
