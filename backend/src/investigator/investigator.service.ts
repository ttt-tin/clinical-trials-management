import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investigator } from './entities/investigator.entity';
import { CreateInvestigatorDto } from './dtos/create-investigator.dto';
import { UpdateInvestigatorDto } from './dtos/update-investigator.dto';
import { Portfolio } from '../portfolio/entities/portfolio.entity';

@Injectable()
export class InvestigatorService {
  constructor(
    @InjectRepository(Investigator)
    private readonly investigatorRepository: Repository<Investigator>,
  ) {}

  async create(
    createInvestigatorDto: CreateInvestigatorDto,
  ): Promise<Investigator> {
    // Check for duplicate email
    const existingInvestigator = await this.investigatorRepository.findOne({
      where: { email: createInvestigatorDto.email },
    });

    if (existingInvestigator) {
      throw new ConflictException(
        'Investigator with this email already exists',
      );
    }

    const investigator = this.investigatorRepository.create(createInvestigatorDto);
    return this.investigatorRepository.save(investigator);
  }

  async findAll(): Promise<Investigator[]> {
    return this.investigatorRepository.find({
      relations: ['portfolios'],
      order: {
        lastName: 'ASC',
        firstName: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Investigator> {
    const investigator = await this.investigatorRepository.findOne({
      where: { id },
      relations: ['portfolios'],
    });

    if (!investigator) {
      throw new NotFoundException(`Investigator with ID ${id} not found`);
    }

    return investigator;
  }

  async findByPortfolioId(portfolioId: number): Promise<Investigator[]> {
    return this.investigatorRepository.find({
      where: { portfolios: { id: portfolioId } },
      relations: ['portfolios'],
      order: {
        lastName: 'ASC',
        firstName: 'ASC',
      },
    });
  }

  async findByEmail(email: string): Promise<Investigator | null> {
    return this.investigatorRepository.findOne({
      where: { email },
      relations: ['portfolios'],
    });
  }

  async update(
    id: number,
    updateInvestigatorDto: UpdateInvestigatorDto,
  ): Promise<Investigator> {
    const investigator = await this.findOne(id);

    if (updateInvestigatorDto.email && updateInvestigatorDto.email !== investigator.email) {
      const existingInvestigator = await this.findByEmail(updateInvestigatorDto.email);
      if (existingInvestigator) {
        throw new ConflictException(
          'Investigator with this email already exists',
        );
      }
    }

    await this.investigatorRepository.update(id, updateInvestigatorDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.investigatorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Investigator with ID ${id} not found`);
    }
  }

  async findActive(): Promise<Investigator[]> {
    return this.investigatorRepository.find({
      where: { isActive: true },
      relations: ['portfolios'],
      order: {
        lastName: 'ASC',
        firstName: 'ASC',
      },
    });
  }
}
