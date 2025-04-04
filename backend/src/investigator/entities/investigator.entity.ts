import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';

export enum InvestigatorRole {
  PRINCIPAL = 'Principal',
  SUB = 'Sub',
  COORDINATOR = 'Coordinator'
}

@Entity('investigators')
export class Investigator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({
    type: 'text',
    enum: InvestigatorRole,
    default: InvestigatorRole.SUB
  })
  role: InvestigatorRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  specialization: string;

  @Column({ type: 'text', nullable: true })
  institution: string;

  @ManyToMany(() => Portfolio)
  @JoinTable({
    name: 'investigator_portfolios',
    joinColumn: {
      name: 'investigator_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'portfolio_id',
      referencedColumnName: 'id'
    }
  })
  portfolios: Portfolio[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
