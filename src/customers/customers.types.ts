import { Customer } from './entities/customer.entity';

export enum ECustomerContactNumberStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'inactive',
}

export interface ICustomerContactNumber {
  number?: string;
  status?: ECustomerContactNumberStatus;
  isPrimary?: boolean;
}

export enum ECustomerAddressStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'inactive',
}

export interface ICustomerAddress {
  address?: string;
  status?: ECustomerAddressStatus;
  isPrimary?: boolean;
}

export enum ECustomerStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'in_active',
}

export type TCustomerOption = Pick<Customer, 'id' | 'name'>;
