import { Agent } from './entities/agent.entity';

export enum EAgentContactNumberStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'inactive',
}

export interface IAgentContactNumber {
  number?: string;
  status?: EAgentContactNumberStatus;
  isPrimary?: boolean;
}

export enum EAgentAddressStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'inactive',
}

export interface IAgentAddress {
  address?: string;
  status?: EAgentAddressStatus;
  isPrimary?: boolean;
}

export enum EAgentStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'in_active',
}

export type TAgentOption = Pick<Agent, 'id' | 'name'>;
