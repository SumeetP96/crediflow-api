import { Customer } from './entities/customer.entity';

export enum ECustomerContactNumberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface ICustomerContactNumber {
  number?: string;
  status?: ECustomerContactNumberStatus;
  isPrimary?: boolean;
}

export enum ECustomerAddressStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ECustomerAddressType {
  HOME = 'home',
  WORK = 'work',
}

export interface ICustomerAddress {
  status?: ECustomerAddressStatus;
  isPrimary?: boolean;
  addressType?: ECustomerAddressType;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
}

export enum ECustomerStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'in_active',
}

export type TCustomerOption = Pick<Customer, 'id' | 'name'>;
