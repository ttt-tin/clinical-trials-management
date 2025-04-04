export enum PortfolioCategory {
  PHASE_1 = 'Phase 1',
  PHASE_2 = 'Phase 2',
  PHASE_3 = 'Phase 3',
  OTHER = 'Other',
}

export interface Portfolio {
  id: number;
  title: string;
  description: string;
  category: string;
  progress: number;
  isActive: boolean;
  updatedAt: Date;
} 