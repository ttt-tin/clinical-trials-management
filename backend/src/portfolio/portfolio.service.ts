import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { CreatePortfolioDto } from './dtos/create-portfolio.dto';
import { UpdatePortfolioDto } from './dtos/update-portfolio.dto';
import { PortfolioCategory } from './entities/portfolio.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
  ) {}

  async create(createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    // Check for duplicate title
    const existingPortfolio = await this.portfolioRepository.findOne({
      where: { title: createPortfolioDto.title },
    });

    if (existingPortfolio) {
      throw new ConflictException('Portfolio with this title already exists');
    }

    const portfolio = this.portfolioRepository.create({
      ...createPortfolioDto,
      tags: createPortfolioDto.tags || [],
    });

    return this.portfolioRepository.save(portfolio);
  }

  async findAll(): Promise<Portfolio[]> {
    return this.portfolioRepository.find({
      order: {
        createdAt: 'DESC', // Most recent first
      },
    });
  }

  async findOne(id: number): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: ['investigators'], // Include related investigators if needed
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }

    return portfolio;
  }

  async update(id: number, updatePortfolioDto: UpdatePortfolioDto): Promise<Portfolio> {
    const portfolio = await this.findOne(id);

    // Check for duplicate title if title is being updated
    if (updatePortfolioDto.title && updatePortfolioDto.title !== portfolio.title) {
      const existingPortfolio = await this.portfolioRepository.findOne({
        where: { title: updatePortfolioDto.title },
      });

      if (existingPortfolio) {
        throw new ConflictException('Portfolio with this title already exists');
      }
    }

    // Update portfolio
    await this.portfolioRepository.update(id, updatePortfolioDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.portfolioRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }
  }

  // Additional helper methods
  async findByTitle(title: string): Promise<Portfolio | null> {
    return this.portfolioRepository.findOne({
      where: { title },
    });
  }

  async findActive(): Promise<Portfolio[]> {
    return this.portfolioRepository.find({
      where: { isActive: true },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByCategory(category: PortfolioCategory): Promise<Portfolio[]> {
    return this.portfolioRepository.find({
      where: { category },
      order: {
        createdAt: 'DESC',
      },
    });
  }
} 