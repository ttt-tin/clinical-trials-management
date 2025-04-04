import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from './entities/portfolio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio]), // Register Portfolio entity
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService], // Export service for use in other modules (e.g., InvestigatorModule)
})
export class PortfolioModule {} 