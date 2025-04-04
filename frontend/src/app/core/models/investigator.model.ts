import { Portfolio } from './portfolio.model';

export enum InvestigatorRole {
  PRINCIPAL = 'Principal',
  SUB = 'Sub',
  COORDINATOR = 'Coordinator'
}

/**
 * Interface representing an Investigator entity from the backend
 */
export interface Investigator {
  /** Auto-incremented ID */
  id: number;

  /** First name of the investigator */
  firstName: string;

  /** Last name of the investigator */
  lastName: string;

  /** Unique email address */
  email: string;

  /** Phone number */
  phone: string;

  /** Role in the clinical trial */
  role: InvestigatorRole;

  /** Whether the investigator is active */
  isActive: boolean;

  /** Medical specialization */
  specialization: string;

  /** Institution/Organization */
  institution?: string;

  /** Timestamp of creation */
  createdAt?: Date;

  /** Timestamp of last update */
  updatedAt?: Date;

  /** Associated portfolios */
  portfolios?: Portfolio[];

  /** Portfolio ID */
  portfolioId: number;
}

/**
 * Interface for creating a new investigator
 * Omits auto-generated fields
 */
export type CreateInvestigatorDto = Omit<Investigator, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Interface for updating an existing investigator
 * Makes all fields optional
 */
export type UpdateInvestigatorDto = Partial<CreateInvestigatorDto>; 