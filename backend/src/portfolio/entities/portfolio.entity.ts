import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PortfolioCategory {
  PHASE_1 = 'Phase 1',
  PHASE_2 = 'Phase 2',
  PHASE_3 = 'Phase 3',
  OTHER = 'Other',
}

@Entity('portfolios')
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'text',
    enum: PortfolioCategory,
    default: PortfolioCategory.OTHER
  })
  category: PortfolioCategory;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  progress: number;

  @Column('simple-array')
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
