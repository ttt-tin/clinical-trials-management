import { Investigator } from "./investigator.model";

/**
 * Portfolio categories as defined in the backend
 */
export enum PortfolioCategory {
  PHASE_1 = 'Phase 1',
  PHASE_2 = 'Phase 2',
  PHASE_3 = 'Phase 3',
  OTHER = 'Other'
}

/**
 * Interface representing a Portfolio entity from the backend
 */
export interface Portfolio {
  /** Auto-incremented ID */
  id: number;

  /** Unique title of the portfolio */
  title: string;

  /** Optional detailed description */
  description: string;

  /** Category/phase of the clinical trial */
  category: PortfolioCategory;

  /** Whether the portfolio is currently active */
  isActive: boolean;

  /** Progress percentage (0-100) */
  progress: number;

  /** Optional array of associated tags */
  tags: string[];

  /** Timestamp of creation */
  createdAt: Date;

  /** Timestamp of last update */
  updatedAt: Date;

  /** Optional array of associated investigators */
  investigators?: Investigator[];
}

/**
 * Interface for creating a new portfolio
 * Omits auto-generated fields
 */
export type CreatePortfolioDto = Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Interface for updating an existing portfolio
 * Makes all fields optional except id
 */
export type UpdatePortfolioDto = Partial<CreatePortfolioDto>; 